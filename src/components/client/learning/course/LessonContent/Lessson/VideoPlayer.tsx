import React, { useCallback, useEffect, useRef, useState } from "react";
import { getVideoIdFromUrl } from "@/Utils/functions";
import { setTimeout } from "timers";

const VideoIframe: React.FC<any> = ({
  isCompleted,
  data,
  setIsCompleted,
}: any) => {
  const playerRef = useRef<YT.Player | null>(null);
  const [watchTime, setWatchTime] = useState(0); // Thời gian đã xem
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false); // Trạng thái tạm dừng video
  const [isFastForwarding, setIsFastForwarding] = useState(false); // Kiểm tra tua nhanh
  const [previousTime, setPreviousTime] = useState(0); // Thời gian trước đó
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null); // ID của timeout
  const [isReady, setIsReady] = useState(false); // Kiểm tra video đã sẵn sàng chưa
  const duration = data?.lessonVideo?.duration || 0; // Lấy độ dài video từ CSDL
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  console.log("Compoent được mount");

  useEffect(() => {
    if (!isCompleted.isPostReq && !isCompleted) {
      if (watchTime / duration >= 0.01) {
        alert();
        setIsCompleted({
          ...isCompleted,
          isCompleted: true,
        });
        return;
      }
    }
  }, [watchTime]);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);

    (window as any).onYouTubeIframeAPIReady = () => {
      const videoId = getVideoIdFromUrl(data?.lessonVideo?.videoLink);
      playerRef.current = new YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: videoId,
        events: {
          onReady: handlePlayerReady,
          onStateChange: handlePlayerStateChange,
        },
      });
    };
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (intervalId) {
        clearInterval(intervalId); // Dọn dẹp interval khi component bị unmount
      }
      if (timeoutId) {
        clearTimeout(timeoutId); // Dọn dẹp timeout khi component bị unmount
      }
    };
  }, [data?.lessonVideo?.videoLink]);

  const handlePlayerReady = (event: any) => {
    setIsReady(true); // Đánh dấu video đã sẵn sàng
  };

  const handlePlayerStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      const player = playerRef.current;

      // Nếu video đang phát
      if (event.data === YT.PlayerState.PLAYING) {
        setIsPaused(false); // Đánh dấu video không bị tạm dừng
        if (intervalId) {
          clearInterval(intervalId); // Dừng lại interval cũ
        }
        const currentTime = player?.getCurrentTime() || 0;
        handleFastForwardDetection(currentTime); // Kiểm tra tua nhanh
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        const newIntervalId = setInterval(() => {
          setWatchTime((pre) => pre + 1);
        }, 1000);
        intervalRef.current = newIntervalId;
      }

      // Nếu video bị dừng (pause) hoặc kết thúc (ended)
      if (
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED
      ) {
        setIsPaused(true); // Đánh dấu video bị tạm dừng
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    },
    []
  );

  const handleFastForwardDetection = (currentTime: number) => {
    const timeDifference = currentTime - previousTime;

    // Kiểm tra nếu video tua nhanh (chênh lệch lớn hơn 10 giây)
    if (timeDifference > 10 && !isFastForwarding) {
      setIsFastForwarding(true); // Bật cảnh báo
      setPreviousTime(currentTime); // Cập nhật thời gian hiện tại

      // Tắt cảnh báo sau 3 giây
      if (timeoutId) {
        clearTimeout(timeoutId); // Dọn dẹp timeout cũ trước khi tạo mới
      }

      const newTimeoutId = setTimeout(() => {
        setIsFastForwarding(false); // Tắt cảnh báo
      }, 3000);

      setTimeoutId(newTimeoutId); // Lưu ID của timeout để dọn dẹp khi cần
    } else if (timeDifference <= 10 && isFastForwarding) {
      setIsFastForwarding(false); // Tắt cảnh báo ngay lập tức
    }
  };

  return (
    <div className="h-[65rem] border-r-5 relative">
      <div id="youtube-player" className="w-full h-full"></div>
      {isFastForwarding && (
        <div className="absolute top-0 left-0 text-[1.4rem] bg-red-500 text-white p-2">
          Đang tua video quá nhanh!
        </div>
      )}
    </div>
  );
};

export default VideoIframe;
