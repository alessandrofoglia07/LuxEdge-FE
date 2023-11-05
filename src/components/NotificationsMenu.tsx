import React, { useEffect } from 'react';
import useSelector from '@/hooks/useSelector';
import Notification from './Notification';
import { useDispatch } from 'react-redux';
import { removeNotificationByIndex } from '@/redux/slices/notificationSlice';

const NotificationsMenu: React.FC = () => {
    const dispatch = useDispatch();

    const notifications = useSelector((state) => state.notifications);

    const alignNotifications = () => {
        notifications.forEach((notification, i) => {
            const el = document.getElementById(`notification-${notification.id}`);
            if (!el) return;
            setTimeout(() => {
                el.style.transform = `translateY(-${8 * i}rem)`;
            }, 0);
            el.style.zIndex = (-i).toString();
        });
    };

    useEffect(() => {
        alignNotifications();
    }, [notifications]);

    return (
        <div id='NotificationsMenu'>
            {notifications.map((notification) => (
                <Notification
                    id={`notification-${notification.id}`}
                    key={notification.id}
                    open
                    message={{ ...notification }}
                    onClose={() => dispatch(removeNotificationByIndex(notification.id))}
                    custom
                    className={'-bottom-28'}
                />
            ))}
        </div>
    );
};

export default NotificationsMenu;
