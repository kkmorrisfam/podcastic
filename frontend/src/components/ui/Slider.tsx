import Slider from '@mui/material/Slider';

export default function MusicSlider({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
}) {
    return (
        <Slider 
            min={0}
            max={duration}
            value={currentTime}
            onChange={(_, value) => onSeek(value as number)}
            size="small"
            sx={{ color: "var(--color-text-primary)",              
                    "& .MuiSlider-track": {
                        border: "none",
                    },
                    "& .MuiSlider-thumb": {
                        width: 14,
                        height: 14,
                        boxShadow: "none",
                        "&:hover": {
                        boxShadow: "0 0 0 6px var(--color-text-secondary)",
                    },
                },
            }}
        />
    );
}