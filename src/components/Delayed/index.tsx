import React, { useState, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  waitBeforeShow?: number;
  moveLogToBottom: Function;
};

const Delayed = ({ children, waitBeforeShow = 500, moveLogToBottom }: Props) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
      moveLogToBottom();
    }, waitBeforeShow);
    return () => clearTimeout(timer);
  }, [waitBeforeShow, moveLogToBottom]);

  return isShown ? <div>{children}</div> : null;
};

export default Delayed;