import Link from "next/link";
import {
  Button,
  ButtonGroup,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Input,
  useDisclosure,
  useInput,
} from "@nextui-org/react";
import {
  ArrowBigRightDashIcon,
  ArrowRightSquareIcon,
  ChevronDown,
  ChevronRightCircle,
  ChevronRightCircleIcon,
  ChevronUp,
  ChevronsRightIcon,
  CircleAlertIcon,
  CircleArrowRightIcon,
  CircleDollarSignIcon,
  CloudUploadIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  EyeOff,
  Handshake,
  Hash,
  LandmarkIcon,
  LineChart,
  ScrollIcon,
  SearchIcon,
  ShieldCheck,
  SmileIcon,
  SunIcon,
  TrendingUpIcon,
  User,
  UserCircleIcon,
  WalletIcon,
} from "lucide-react";
import icons from "currency-icons";
import { useState } from "react";
import clsx from "clsx";
import DepositionScreen from "./deposition-screen";
import WithdrawlScreen from "./withdrawl-screen";
import QuickWalletActions from "./quick-wallet-actions";
import commaNumber from "comma-number";

export const figureAsBalance = (figure: number) => {
  return commaNumber(figure) + ".00";
};

export default function Wallet() {
  const user = {
    firstname: "Sunday",
    lastname: "Awanu",
    wallet: {
      balance: 64_000,
      settings: {
        balanceVisible: true,
      },
    },
  };

  const [balanceVisible, setBalanceVisible] = useState(
    user.wallet.settings.balanceVisible
  );

  const renderBalanceVisibilityToggleContent = (balanceVisible: boolean) => {
    const actionAccessible = {
      label: balanceVisible ? "Hide" : "Show",
      Icon: balanceVisible ? EyeOff : EyeIcon,
    };

    return (
      <>
        {<actionAccessible.Icon className="me-0.5 size-3" />}
        {actionAccessible.label} balance{" "}
      </>
    );
  };

  const {
    isOpen: depositing,
    onOpen: startDepositProcess,
    onOpenChange: onDeposit,
    onClose: closeDepositProcess,
  } = useDisclosure();

  const {
    isOpen: withdrawing,
    onOpen: startWithdrawlProcess,
    onOpenChange: onWithdraw,
    onClose: pauseWithdrawlProcess,
  } = useDisclosure();

  const receiptAttached = false;
  const withdrawlReceiptAttached = false;

  const [depositTransactionDetails, setDepositTransactionDetails] = useState({
    detailsHidden: false,
    amount: 2000,
    date: "20th July, 2024",
    description: "DEPOSIT to RML-PAID Wallet",
  });

  const [withdrawlTransactionDetails, setWithdrawlTransactionDetails] =
    useState({
      detailsHidden: false,
      amount: 2000,
      date: "20th July, 2024",
      description: "DEPOSIT to RML-PAID Wallet",
    });

  const [amountToBeDeposited, setAmountToBeDeposited] = useState(0);
  const [amountToBeWithdrawn, setAmountToBeWithdrawn] = useState(0);
  const [depositProcessStep, setDepositProcessStep] = useState(1);
  const [withdrawProcessStep, setWithdrawlProcessStep] = useState(1);

  return (
    <section className="grid gap-y-2 grow">
      <div className="cardBackground border rounded-t-xl flex flex-col max-w-xl lg:max-w-lg grow w-full shrink-0 lg:shrink p-5 pb-6 justify-center mx-auto">
        <h3 className="text-xs text-zinc-400 flex flex-col mb-6">
          <span className="flex items-center gap-x-2"><SmileIcon className="size-4" /> Good morning,</span>
          <span className="text-white text-base">
            Mr. {user.lastname} {user.firstname}
          </span>
        </h3>

        <div className="flex flex-wrap items-end justify-between gap-y-4 gap-x-4">
          <p about="total-user-balance">
            <span className="flex items-center whitespace-nowrap mb-1 text-xs sm:text-sm gap-x-1 text-zinc-400">
              <WalletIcon className="me-1 size-4" />
              Total Balance
            </span>
            <span
              className={clsx("text-4xl font-medium", {
                blur: !balanceVisible,
              })}
            >
              {icons["NGN"]?.symbol || "#"}
              {figureAsBalance(user.wallet.balance)}
            </span>
          </p>
          <Button
            variant="flat"
            // color="primary"
            size="sm"
            className="rounded-md mb-1 text-primary.."
            onClick={() => setBalanceVisible((visible) => !visible)}
          >
            {renderBalanceVisibilityToggleContent(balanceVisible)}
          </Button>
        </div>

        <Link
          href="#investment-portfolio"
          className="flex items-center gap-x-4 justify-between mt-6 mb-2 max-w-md"
        >
          <Progress
            label={
              <span className="flex items-center gap-x-2 text-zinc-400">
                <TrendingUpIcon className="text-success.. size-4" /> Investments 
              </span>
            }
            size="sm"
            value={7}
            maxValue={30}
            valueLabel={`${icons["NGN"]?.symbol || "#"} 40,00`}
            showValueLabel={true}
            className="w-full hover font-medium"
          />
          <span className="p-1.5 rounded-md bg-default-100 grid place-content-center text-zinc-200 hover:text-primary">
            <CircleArrowRightIcon className="size-5" />
          </span>
        </Link>

        {/* <ButtonGroup
          className="mt-auto.. items-start flex gap-1 flex-wrap content-end shadow-lg"
          variant="solid"
          // variant="light"
          color="primary"
          size="md"
        >
          <Button
            className="shadow-lg grow font-medium !rounded-md xl:!rounded-s-lg xl:!rounded-e-none"
            startContent={<DownloadIcon size={20} />}
            // className="shadow-lg grow font-medium !rounded-md xl:!rounded-s-lg xl:rounded-e-none flex-col h-20"
            // startContent={<DownloadIcon size={20} className="lg:size-8 flex-shrink-0" />}
            onClick={() => startDepositProcess()}
          >
            Deposit
          </Button>
          <Button
            className="shadow-lg grow font-medium !rounded-md xl:!rounded-none"
            startContent={<CircleDollarSignIcon size={20} />}
            onClick={() => startWithdrawlProcess()}
          >
            Withdraw
          </Button>
          <Button
            as={Link}
            href="#investment-portfolio"
            className="shadow-lg grow font-medium !rounded-md xl:!rounded-e-lg xl:!rounded-s-none"
            startContent={<Handshake size={20} />}
          >
            Invest
          </Button>
        </ButtonGroup> */}
      </div>

      <div className="cardBackground border rounded-b-xl flex flex-col max-w-xl lg:max-w-lg grow w-full shrink-0 lg:shrink p-3 sm:ptb-1.5 mx-auto">
        <QuickWalletActions />
      </div>

      <DepositionScreen
        depositing={depositing}
        onDeposit={onDeposit}
        depositProcessStep={depositProcessStep}
        amountToBeDeposited={amountToBeDeposited}
        setAmountToBeDeposited={setAmountToBeDeposited}
        setDepositProcessStep={setDepositProcessStep}
        depositTransactionDetails={depositTransactionDetails}
        setDepositTransactionDetails={setDepositTransactionDetails}
        receiptAttached={receiptAttached}
        closeDepositProcess={closeDepositProcess}
      />

      <WithdrawlScreen
        withdrawing={withdrawing}
        onWithdraw={onWithdraw}
        withdrawProcessStep={withdrawProcessStep}
        amountToBeWithdrawn={amountToBeWithdrawn}
        setAmountToBeWithdrawn={setAmountToBeWithdrawn}
        setWithdrawlProcessStep={setWithdrawlProcessStep}
        withdrawlTransactionDetails={withdrawlTransactionDetails}
        setWithdrawlTransactionDetails={setWithdrawlTransactionDetails}
        withdrawlReceiptAttached={withdrawlReceiptAttached}
        pauseWithdrawlProcess={pauseWithdrawlProcess}
      />
    </section>
  );
}
