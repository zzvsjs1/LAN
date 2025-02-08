import React, { createContext, useEffect, useReducer } from "react";
import CLIENT from "../apollo/client";
import gql from "graphql-tag";
import { POST_RETURN_QUERY, PostObj, REPLY_RETURN_QUERY, ReplyObj } from "../backend/postAndReplyUtils";
import getUniqueID from "../backend/getUniqueID";

// The context object.
export const SubscriptionContext = createContext<SubscriptionContextT>({} as SubscriptionContextT);

/**
 * Allow three different subscription object.
 */
export enum SubscriptionType {
  POST_REACTION_ISSUE = 'post',
  REPLY_REACTION_ISSUE = 'reply',
  ERROR = 'error',
}

// Get the description string.
export function subscriptionTypeToString(type: SubscriptionType): string {
  switch (type) {
    case SubscriptionType.ERROR: {
      return 'Error';
    }
    case SubscriptionType.POST_REACTION_ISSUE: {
      return 'Too many negative post reactions.'
    }
    case SubscriptionType.REPLY_REACTION_ISSUE: {
      return 'Too many negative reply reactions.'
    }
    default: {
      throw new Error('Unknown type.');
    }
  }
}

export interface SubscriptionObj {
  id: string,
  post?: PostObj
  reply?: ReplyObj,
  error?: any,
  type: SubscriptionType,
}

export type SubscriptionContextT = {
  state: SubscriptionObj[],
  dispatch: React.Dispatch<ACTION_TYPE>,
}

// Init state is an empty array.
const INIT_STATE: SubscriptionObj[] = [];

// Support three operation type.
export enum ACTION_OPERATION_TYPE {
  ADD = 'ADD',
  DELETE = 'DELETE',
  CLEAN = 'CLEAN',
}

// Support three type of operations.
export type ACTION_TYPE =
  | { type: typeof ACTION_OPERATION_TYPE.ADD; payload: SubscriptionObj }
  | { type: typeof ACTION_OPERATION_TYPE.DELETE; payload: string }
  | { type: typeof ACTION_OPERATION_TYPE.CLEAN };

// The general reduce for our subscription object.
function reducer(state: SubscriptionObj[], action: ACTION_TYPE): SubscriptionObj[] {
  switch (action.type) {
    // Add operation.
    case ACTION_OPERATION_TYPE.ADD: {
      return [...state, action.payload];
    }
    // Delete operation.
    case ACTION_OPERATION_TYPE.DELETE: {
      return state.filter(value => value.id !== action.payload);
    }
    // Clean operation.
    case ACTION_OPERATION_TYPE.CLEAN: {
      return [];
    }
    // Not a valid operation.
    default: {
      throw new Error('Unknown action');
    }
  }
}

/**
 * Allow passing jsx element.
 */
export type SubscriptionContextProviderProps = {
  children: JSX.Element,
}

export function SubscriptionContextProvider({ children }: SubscriptionContextProviderProps) {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  useEffect(() => {
    // Create two subscriptions.
    const postSubscription = CLIENT.subscribe({
      query: gql`
        subscription {
          postReactionIssue {
          ${POST_RETURN_QUERY}
        } 
      }`
    }).subscribe({
      next: payload => {
        const obj: SubscriptionObj = {
            id: getUniqueID(),
            type: SubscriptionType.POST_REACTION_ISSUE,
            post: payload.data.postReactionIssue
          };

        dispatch({ type: ACTION_OPERATION_TYPE.ADD, payload: obj });
      },
      error(errorValue: any) {
        const obj: SubscriptionObj = {
          id: getUniqueID(),
          type: SubscriptionType.ERROR,
          error: errorValue ?? new Error('Unknown error.'),
        };

        dispatch({ type: ACTION_OPERATION_TYPE.ADD, payload: obj });
      }
    });

    const replySubscription = CLIENT.subscribe({
      query: gql`
        subscription {
          replyReactionIssue {
          ${REPLY_RETURN_QUERY}
        } 
      }`
    }).subscribe({
      next: payload => {
        const obj: SubscriptionObj = {
            id: getUniqueID(),
            type: SubscriptionType.REPLY_REACTION_ISSUE,
            reply: payload.data.replyReactionIssue
          };

        dispatch({ type: ACTION_OPERATION_TYPE.ADD, payload: obj });
      },
      error(errorValue: any) {
        const obj: SubscriptionObj = {
          id: getUniqueID(),
          type: SubscriptionType.ERROR,
          error: errorValue ?? new Error('Unknown error.'),
        };

        dispatch({ type: ACTION_OPERATION_TYPE.ADD, payload: obj });
      }
    });

    // Cleanup.
    return () => {
      postSubscription.unsubscribe();
      replySubscription.unsubscribe();
    }
  }, []);

  const value: SubscriptionContextT = {
    state: state,
    dispatch: dispatch,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}