import React, { ReactNode } from 'react';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import styles from './scamPhishingStyles.scss';

interface AuthorizationInfo {
  url: string;
  duration: string;
}

export interface ScamPhishingAlertPropsType {
  url: string;
  className?: string;
  icon?: ReactNode;
  authorizationInfo?: AuthorizationInfo;
}

export const ScamPhishingAlert = (props: ScamPhishingAlertPropsType) => {
  const { className, url, icon, authorizationInfo } = props;
  const sanitizedUrl = url.replace('https://', '').replace(/\/$/, '');
  const sanitizedAuthUrl = authorizationInfo?.url
    ? authorizationInfo.url.replace('https://', '').replace(/\/$/, '')
    : '';

  return (
    <>
      <p className={classNames(styles.scamPhishingAlert, className)}>
        {icon || (
          <FontAwesomeIcon
            className={styles.scamPhishingAlertIcon}
            icon={faLock}
          />
        )}

        <span className={styles.scamPhishingAlertText}>
          <span>Scam/Phishing verification:</span>{' '}
          <span className={styles.scamPhishingAlertPrefix}>
            <strong>https://</strong>
            {sanitizedUrl}
          </span>
        </span>
      </p>
      {authorizationInfo?.url && (
        <p
          className={classNames(
            styles.scamPhishingAlert,
            'mt-2 column',
            className
          )}
        >
          <span className={styles.scamPhishingAlertText}>
            <span>Please confirm that you are indeed connecting to</span>
            <span className={styles.scamPhishingAlertPrefix}>
              <strong>https://</strong>
              {sanitizedAuthUrl} for{' '}
              <strong>{authorizationInfo.duration}</strong> and that you trust
              this site.
            </span>
          </span>
          <span className={styles.scamPhishingAlertText}>
            You might be sharing sensitive data.
          </span>
          <a href='https://multiversx.com/faq'>Learn more</a>
        </p>
      )}
    </>
  );
};
