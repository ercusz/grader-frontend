import { useIsOverflow } from '@/hooks/is-overflow/useIsOverflow';
import { Link } from '@mui/material';
import Linkify from 'linkify-react';
import { useRef, useState } from 'react';

export interface IPostContent {
  content: string;
  viewMoreButton?: boolean;
}

const PostContent: React.FC<IPostContent> = ({ content, viewMoreButton }) => {
  const [viewMore, setViewMore] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const isOverflow = useIsOverflow(ref);

  const renderLink = ({
    attributes,
    content,
  }: {
    attributes: {
      [attr: string]: any;
    };
    content: string;
  }) => {
    const { href, ...props } = attributes;
    return (
      <Link href={href} target="_blank" {...props}>
        {content}
      </Link>
    );
  };

  return (
    <>
      <div
        ref={ref}
        style={
          !viewMoreButton || !viewMore
            ? {
                whiteSpace: 'break-spaces',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 3,
              }
            : {
                whiteSpace: 'break-spaces',
              }
        }
      >
        <Linkify
          as="p"
          options={{
            render: {
              url: renderLink,
            },
          }}
          style={{
            margin: 0,
          }}
        >
          {content}
        </Linkify>
      </div>
      {viewMoreButton && isOverflow && (
        <Link
          component="button"
          variant="subtitle2"
          underline="hover"
          color="textSecondary"
          onClick={() => setViewMore(true)}
          sx={{ mt: 1 }}
        >
          ดูเพิ่มเติม
        </Link>
      )}
      {viewMoreButton && viewMore && (
        <Link
          component="button"
          variant="subtitle2"
          underline="hover"
          color="textSecondary"
          onClick={() => setViewMore(false)}
          sx={{ mt: 1 }}
        >
          ดูน้อยลง
        </Link>
      )}
    </>
  );
};

export default PostContent;
