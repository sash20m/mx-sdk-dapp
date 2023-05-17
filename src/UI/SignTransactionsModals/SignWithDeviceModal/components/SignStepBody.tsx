import React from 'react';
import { Address } from '@multiversx/sdk-core/out';
import classNames from 'classnames';

// import globalStyles from 'assets/sass/main.scss';

import { useGetNetworkConfig } from 'hooks';
import { useGetTokenDetails } from 'hooks/transactions/useGetTokenDetails';
import type {
  ActiveLedgerTransactionType,
  MultiSignTransactionType
} from 'types';
// import { TokenDetails } from 'UI/TokenDetails';
import { NftEnumType } from 'types/tokens.types';
import { TransactionData } from 'UI/TransactionData';
import { getIdentifierType } from 'utils';
import { getEgldLabel } from 'utils/network/getEgldLabel';
import { formatAmount } from 'utils/operations/formatAmount';
import { isTokenTransfer } from 'utils/transactions/isTokenTransfer';

import { useSignStepsClasses } from '../hooks';
import { ConfirmAmount } from './components/ConfirmAmount';
import { ConfirmFee } from './components/ConfirmFee';
import { ConfirmReceiver } from './components/ConfirmReceiver';
import styles from './signStepBodyStyles.scss';

export interface SignStepInnerClassesType {
  buttonsWrapperClassName?: string;
  inputGroupClassName?: string;
  inputLabelClassName?: string;
  inputValueClassName?: string;
  errorClassName?: string;
  scamAlertClassName?: string;
  buttonClassName?: string;
  progressClassName?: string;
}

export interface SignStepBodyPropsType {
  error: string | null;
  callbackRoute?: string;
  currentStep: number;
  currentTransaction: ActiveLedgerTransactionType | null;
  allTransactions: MultiSignTransactionType[];
  signStepInnerClasses?: SignStepInnerClassesType;
  isGuarded?: boolean;
}

export const SignStepBody = ({
  currentTransaction,
  error,
  signStepInnerClasses
}: SignStepBodyPropsType) => {
  const egldLabel = getEgldLabel();

  if (!currentTransaction) {
    return null;
  }

  const { network } = useGetNetworkConfig();
  const {
    inputGroupClassName,
    inputLabelClassName,
    inputValueClassName,
    errorClassName
    // scamAlertClassName
  } = signStepInnerClasses || {};

  const { tokenId, nonce, amount, multiTxData, receiver } =
    currentTransaction.transactionTokenInfo;

  const isTokenTransaction = Boolean(
    tokenId && isTokenTransfer({ tokenId, erdLabel: egldLabel })
  );

  const { isNft } = getIdentifierType(tokenId);

  // If the token has a nonce means that this is an NFT. Eg: TokenId=TOKEN-1hfr, nonce=123 => NFT id=TOKEN-1hfr-123
  const appendedNonce = nonce ? `-${nonce}` : '';
  const nftId = `${tokenId}${appendedNonce}`;

  const { tokenDecimals, tokenAvatar, type } = useGetTokenDetails({
    tokenId: nonce && nonce.length > 0 ? nftId : tokenId
  });

  const formattedAmount = formatAmount({
    input: isTokenTransaction
      ? amount
      : currentTransaction.transaction.getValue().toString(),
    decimals: isTokenTransaction ? tokenDecimals : Number(network.decimals),
    digits: Number(network.digits),
    showLastNonZeroDecimal: false,
    addCommas: true
  });

  const scamReport = currentTransaction.receiverScamInfo;
  const classes = useSignStepsClasses(scamReport);

  const token = isNft ? nftId : tokenId || egldLabel;
  const shownAmount = isNft ? amount : formattedAmount;

  return (
    <>
      {currentTransaction.transaction && (
        <div className={styles.summary}>
          <div className={styles.fields}>
            <ConfirmReceiver
              scamReport={scamReport}
              receiver={
                multiTxData
                  ? new Address(receiver).bech32()
                  : currentTransaction.transaction.getReceiver().toString()
              }
            />

            <div className={styles.columns}>
              {/* {!isNFT && (
                <div className={styles.column}>
                  <Confirm.Amount
                    txType={txType}
                    tokenId={tokenId}
                    tokenDecimals={tokenDetails.decimals}
                    amount={String(amountInfo.amount)}
                    nft={nft}
                    egldPriceInUsd={egldPriceInUsd}
                    egldLabel={egldLabel}
                    tokenLabel={tokenDetails.name}
                    tokenAvatar={tokenDetails.assets?.svgUrl || ''}
                  />
                </div>
              )} */}

              {type !== NftEnumType.NonFungibleESDT && (
                <div className={styles.column}>
                  <ConfirmAmount
                    tokenAvatar={tokenAvatar}
                    amount={shownAmount}
                    token={token}
                    tokenType={type ?? 'EGLD'}
                  />
                </div>
              )}

              <div className={styles.column}>
                <ConfirmFee
                  tokenAvatar={tokenAvatar}
                  egldLabel={egldLabel}
                  transaction={currentTransaction.transaction}
                />
              </div>
            </div>

            {currentTransaction.transaction.getData() && (
              <TransactionData
                isScCall={!tokenId}
                data={currentTransaction.transaction.getData().toString()}
                highlight={multiTxData}
                className={inputGroupClassName}
                innerTransactionDataClasses={{
                  transactionDataInputLabelClassName: inputLabelClassName,
                  transactionDataInputValueClassName: inputValueClassName
                }}
              />
            )}

            {error && (
              <p className={classNames(classes.errorMessage, errorClassName)}>
                {error}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
