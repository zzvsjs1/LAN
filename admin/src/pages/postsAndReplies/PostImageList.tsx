import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { PostImgObj } from "../../backend/postAndReplyUtils";

type PostImageListProps = {
  images: PostImgObj[]
}

/**
 * Display the image for a post.
 *
 * @param images
 * @constructor
 */
export default function PostImageList({ images }: PostImageListProps) {
  return (
    <>
      {/* Note: We want the list auto wrap when overflowed. */}
      <ImageList
        sx={{
          m: 0,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 0,
        }}
        rowHeight={'auto'}
      >
        {
          images.sort((a: PostImgObj, b: PostImgObj) => a.order - b.order)
            .map((postImg) => (
              <ImageListItem
                sx={{ width: 120, height: 120 }}
                key={postImg.url}
              >
                {/* Fix size image. Larger than front end version. */}
                <img
                  style={{
                    height: '100px',
                    width: '100px',
                    objectFit: 'cover',
                    overflow: 'hidden',
                    borderRadius: '4px',
                  }}
                  src={postImg.url}
                  srcSet={postImg.url}
                  alt={postImg.url}
                  loading={'lazy'}
                />
              </ImageListItem>
            ))
        }
      </ImageList>
    </>
  );
}