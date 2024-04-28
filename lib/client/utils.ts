export const cls = (...classnames: string[]) => {
  return classnames.join(" ");
};

export const convertTime = (value: string) => {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return "방금 전";
  if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일 전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년 전`;
};

export const convertPrice = (price: number) => {
  return `${price.toLocaleString("ko-KR")}원`;
};

export const scrollToBottom = () =>
  window.scrollTo(0, document.body.scrollHeight);

export const randomColor = () => {
  return `#${Math.round(Math.random() * 0xffffff).toString(16)}`;
};

export const intlDate = (date: Date) => {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(date));
};
