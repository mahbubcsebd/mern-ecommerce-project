/* eslint-disable react/prop-types */

import { Link } from "react-router";

const VideoCard = ({video}) => {
    const { title, thumbnail, date, link } = video;
  return (
      <div>
          <Link to={link}>
              <img
                  src={thumbnail}
                  alt={title}
              />
          </Link>
          <h1 className="text-lg font-medium">{title}</h1>
          <h1>{date}</h1>
      </div>
  );
}

export default VideoCard