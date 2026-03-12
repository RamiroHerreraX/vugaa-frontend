import React, { useEffect } from "react";
import { Box, Typography, LinearProgress, Fade } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const colors = {
  primary: { main: "#133B6B" },
  secondary: { main: "#00A8A8" },
  text: { secondary: "#3A6EA5" },
};

const UploadProgress = ({ progress, fileName, onComplete }) => {
  useEffect(() => {
    if (progress >= 100 && onComplete) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <Fade in={progress > 0 && progress < 100}>
      <Box sx={{ width: "100%", mt: 2, mb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <CloudUploadIcon
            sx={{ color: colors.primary.main, fontSize: "1rem" }}
          />
          <Typography
            variant="caption"
            sx={{ color: colors.text.secondary, flex: 1, fontWeight: 500 }}
          >
            Subiendo: {fileName}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: colors.primary.main }}
          >
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: colors.primary.main,
              transition: "transform 0.2s linear",
              backgroundImage: `linear-gradient(90deg, ${colors.primary.main}, ${colors.secondary.main})`,
            },
          }}
        />
      </Box>
    </Fade>
  );
};

export default UploadProgress;