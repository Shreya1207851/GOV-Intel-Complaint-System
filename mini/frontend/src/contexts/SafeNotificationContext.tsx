import React from "react";
import { NotificationProvider } from "./NotificationContext";

export const SafeNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    // Try to mount the notification provider
    try {
      // If any error occurs during mount, catch it
      console.log("SafeNotificationProvider mounting");
    } catch (error) {
      console.error("Failed to mount NotificationProvider:", error);
      setHasError(true);
    }
  }, []);

  if (hasError) {
    console.warn("NotificationProvider failed to load, using children only");
    return <>{children}</>;
  }

  try {
    return <NotificationProvider>{children}</NotificationProvider>;
  } catch (error) {
    console.error("NotificationProvider render error:", error);
    return <>{children}</>;
  }
};
