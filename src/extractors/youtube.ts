import _ from "lodash";

function addLeadingZero(number: number) {
  return number < 10 ? "0" + number : number;
}

function convertToHoursMinutesSeconds(seconds: any): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(
    remainingSeconds
  )}`;
}

function extractVideoYT(
  url: string,
  videoDetails: any,
  thumbnail_url: any,
  formats: any,
  videoFormatsInfor: any
) {
  const time: string = convertToHoursMinutesSeconds(
    parseInt(videoDetails.lengthSeconds)
  );
  const videoFormats = videoFormatsInfor.map((format: any) => {
    let durationInSeconds: number = 0;
    let estimatedSizeInBytes: number = 0;
    if (format && format.approxDurationMs && format.bitrate) {
      durationInSeconds = parseInt(format.approxDurationMs) / 1000;
      estimatedSizeInBytes = (format.bitrate * durationInSeconds) / 8;
    }
    const approxDurationMs: any = format.approxDurationMs;
    const durationInMinutes = approxDurationMs / 60000;
    let estimatedSizeInMB = (estimatedSizeInBytes / (1024 * 1024)).toFixed(2);

    return {
      url: format.url,
      bitrate: format.bitrate,
      size: !estimatedSizeInMB ? "Unknown" : estimatedSizeInMB + "MB",
      durationInSeconds: format.approxDurationMs,
      ext: format.container,
      width: format.width,

      height: format.height,
      rate: `${format.bitrate || ""}`,
      quality: format.qualityLabel || format.quality,
    };
  });
  const quanlity: any = [];
  formats.map((value: any, index: number) => {
    if (quanlity.indexOf(value.qualityLabel) === -1) {
      quanlity.push(value.qualityLabel);
    }
  });
  return {
    // id,
    origin_url: url,
    author: _.get(videoDetails, "author"),
    thumbnail_pc: videoDetails.thumbnails,
    thumbnail:
      thumbnail_url ||
      _.get(videoDetails, "thumbnails[0].url") ||
      _.get(videoDetails, "thumbnail.thumbnails[0].url", ""),
    formats: videoFormats.reverse(),
    time: time,
    title:
      _.get(videoDetails, "title") || _.get(videoDetails, "description", "")!,
    quality: quanlity,
  };
}

export { addLeadingZero, convertToHoursMinutesSeconds, extractVideoYT };
