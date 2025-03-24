import { fetchVideos } from "@/rtk/features/videos/videosSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../globals/Loading";
import VideoCard from "./VideoCard";

const VideosList = () => {

    const dispatch = useDispatch();
    const {videos, isLoading, isError, error} = useSelector(state => state.videos)

    useEffect(() => {
        dispatch(fetchVideos());
    }, [dispatch]);

    // decide what to render
    let content;

    if(isLoading) content = <Loading />;
    if(!isLoading && isError) content = <div>{error}</div>;

    if(!isLoading && !isError && videos?.length === 0) content = <div>No videos found</div>
    if(!isLoading && !isError && videos?.length > 0) content = videos.map((video) => (
        <div key={video.id}>
            <VideoCard video={video} />
        </div>
    ));


  return (
    <div>
        <h1>Video List</h1>
        <div className="grid grid-cols-4 gap-5">
            {content}
        </div>
    </div>
  )
}

export default VideosList