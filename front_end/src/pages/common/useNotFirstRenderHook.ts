import { useEffect, useRef } from "react";

/**
 * This hook is a hack way to check if a component is mounted by first.
 * It can use to skip the useEffect update.
 *
 * The first version use useState, but it slows down the web page.
 * So I found
 * https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
 * Author: Scotty Waggoner.
 *
 * Therefore, I change it to useRef.
 */
function useNotFirstRenderHook(): boolean {
  const isFirstRender = useRef<boolean>(true);

  useEffect(
    () => {
      isFirstRender.current = false;
    }, []
  );

  return isFirstRender.current;
}

export default useNotFirstRenderHook;
