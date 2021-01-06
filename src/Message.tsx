import React, { forwardRef } from 'react';
import './Message.css';
import { Avatar } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import * as timeago from 'timeago.js';
import Linkify from 'react-linkify';

const Message = forwardRef(
  (
    {
      id,
      contents: {
        timestamp,
        displayName,
        email,
        uid,
        message,
        photo,
        darkMode,
      },
    }: any,
    ref,
  ) => {
    const user = useSelector(selectUser);
    const componentDecorator = (
      href: string,
      text: string,
      key: string | number | null | undefined,
    ) => (
      <a href={href} key={key} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    );

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`message ${user.email === email && 'message_sender'}`}
      >
        <Avatar className="message_photo" src={photo} />
        <p
          className={
            darkMode
              ? 'message__dark messagep dark-mode'
              : 'message__light messagep light-mode'
          }
        >
          <Linkify componentDecorator={componentDecorator}>{message}</Linkify>
        </p>
        <small>
          {timeago.format(new Date(timestamp?.toDate()).toLocaleString())}
        </small>
      </div>
    );
  },
);

export default Message;
