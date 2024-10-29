export function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  };

  return date.toLocaleString('en-US', options);
}

export function generateSimilarColors(baseColor, numColors) {
  // Chuyển đổi mã màu Hex thành các giá trị RGB
  const baseRed = parseInt(baseColor.slice(1, 3), 16);
  const baseGreen = parseInt(baseColor.slice(3, 5), 16);
  const baseBlue = parseInt(baseColor.slice(5, 7), 16);

  // Tính toán khoảng cách giữa các màu dựa trên tone (cùng giữ nguyên độ sáng và độ mờ)
  const toneDistance = Math.floor(255 / (numColors + 1));

  // Tạo mã màu cho từng mức độ tương tự
  const similarColors = [];
  for (let i = 1; i <= numColors; i++) {
    const red = baseRed + i * toneDistance;
    const green = baseGreen + i * toneDistance;
    const blue = baseBlue + i * toneDistance;

    // Chuyển đổi giá trị RGB thành chuỗi mã màu Hex
    const hex = ((red << 16) | (green << 8) | blue).toString(16).padStart(6, '0');
    const color = `#${hex}`;

    similarColors.push(color);
  }

  return similarColors;
}
