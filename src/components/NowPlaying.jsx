import React, { forwardRef, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Slider,
  CircularProgress,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import LoopIcon from "@mui/icons-material/Loop";
import ShuffleIcon from "@mui/icons-material/Shuffle";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const NowPlaying = forwardRef((props, ref) => {
  const {
    currentSong,
    songs,
    isPlaying,
    onPlayPause,
    onNext,
    onPrevious,
    onSeek,
  } = props;
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const currentIndex = useMemo(() => {
    return songs.findIndex((el) => el.id === currentSong.song.id);
  }, [currentSong, songs]);

  useEffect(() => {
    const audio = ref.current;
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleMetadata);
      audio.addEventListener("loadeddata", handleLoadedData);
      audio.addEventListener("loadstart", handleLoadStart);
    }
    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleMetadata);
        audio.removeEventListener("loadeddata", handleLoadedData);
        audio.removeEventListener("loadstart", handleLoadStart);
      }
    };
  }, []);

  const handleMetadata = () => {
    if (ref.current) {
      setDuration(ref.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (ref.current) {
      setCurrentTime(ref.current.currentTime);
    }
  };

  const handleLoadedData = () => {
    setLoading(false);
  };

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleSeek = (_, value) => {
    onSeek(value);
  };

  const handleNextSong = () => {
    onNext(songs.length - 1 === currentIndex ? 0 : currentIndex + 1);
  };

  useEffect(() => {
    if (currentTime === duration && duration !== 0) {
      handleNextSong();
    }
  }, [currentTime, duration]);

  return (
    <Box
      sx={{
        bgcolor: "#760000",
        color: "#fff",
        m: 2,
        padding: "10px",
        borderRadius: "15px",
        width: "100%",
        textAlign: "center",
      }}
    >
      <Typography variant="caption">Now Playing</Typography>
      <Box
        component="img"
        src={currentSong.song.cover}
        alt={currentSong.song.title}
        sx={{
          width: "100%",
          height: { xs: 300, sm: 400, md: 120 },
          borderRadius: "10px",
          marginY: "10px",
        }}
      />
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {currentSong.song.title}
      </Typography>
      <Typography variant="caption">{currentSong.song.artist}</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginY: "10px",
        }}
      >
        <Typography variant="caption">{formatTime(currentTime)}</Typography>
        <Slider
          value={currentTime}
          min={0}
          max={duration}
          onChange={handleSeek}
          sx={{ color: "#fff", marginX: "25px", flexGrow: 1 }}
        />
        <Typography variant="caption">{formatTime(duration)}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton>
          <LoopIcon sx={{ color: "#fff" }} />
        </IconButton>
        <IconButton
          disabled={currentIndex === 0}
          onClick={() => onPrevious(currentIndex - 1)}
        >
          <SkipPreviousIcon sx={{ color: "#fff" }} />
        </IconButton>
        <IconButton onClick={onPlayPause}>
          {isPlaying && !loading ? (
            <PauseIcon sx={{ color: "#fff", fontSize: "30px" }} />
          ) : !isPlaying && !loading ? (
            <PlayArrowIcon sx={{ color: "#fff", fontSize: "30px" }} />
          ) : !isPlaying && loading ? (
            <CircularProgress
              style={{ width: "16px", height: "16px", color: "#fff" }}
            />
          ) : (
            <PauseIcon sx={{ color: "#fff", fontSize: "30px" }} />
          )}
        </IconButton>
        <IconButton onClick={handleNextSong}>
          <SkipNextIcon sx={{ color: "#fff" }} />
        </IconButton>
        <IconButton>
          <ShuffleIcon sx={{ color: "#fff" }} />
        </IconButton>
      </Box>
      <audio ref={ref} src={currentSong?.song?.song} />
    </Box>
  );
});

export default NowPlaying;
