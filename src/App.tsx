import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { RandomReveal } from "react-random-reveal";
import Dialog from '@mui/material/Dialog';
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import "./App.css";
import Delayed from "./components/Delayed";
import Dice from "./components/Dice";
import questionIcon from "./images/question.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
interface EpochData {
  epoch: string;
  alpha: string;
  gamma: string;
  c: string;
  s: string;
  y: string;
  witness_address: string;
  witness_gamma: string;
  witness_hash: string;
  inverse_z: string;
  signature_proof: string;
  created_date: string;
}
interface FormatedEpochData {
  'Gamma.X': string;
  'Gamma.Y': string;
  c: string;
  s: string;
  y: string;
}

interface Log {
  message: string;
  isAnimate?: boolean;
  timeToShow?: number;
}

const hexRandomCharacterSet = [
  'a',
  'b',
  'c',
  'e',
  'f',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
];
const DICE_IDs = ['1_ST', '2_ND', '3_RD'];

const App = () => {
  const [isRolling, setIsRolling] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [noDelayLogs, setNoDelayLogs] = useState<Log[]>([]);
  const [latestData, setLatestData] = useState<EpochData>();
  const [epochData, setEpochData] = useState<EpochData>();
  const [formatedEpochData, setFormatedEpochData] =
    useState<FormatedEpochData>();
  const [isShowingLatestData, setIsShowingLatestData] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };


  const rollDice = (number: number, id: string) => {
    const dice: any = document.getElementById(id);
    switch (number) {
      case 1:
        dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
        break;
      case 6:
        dice.style.transform = 'rotateX(180deg) rotateY(0deg)';
        break;
      case 2:
        dice.style.transform = 'rotateX(-90deg) rotateY(0deg)';
        break;
      case 5:
        dice.style.transform = 'rotateX(90deg) rotateY(0deg)';
        break;
      case 3:
        dice.style.transform = 'rotateX(0deg) rotateY(90deg)';
        break;
      case 4:
        dice.style.transform = 'rotateX(0deg) rotateY(-90deg)';
        break;
      default:
        break;
    }
    setIsRolling(false);
    dice.style.animation = 'none';
  };

  const handleRoll = async () => {
    setIsShowingLatestData(false);
    if (isRolling) {
      return;
    }
    const _logs = logs;
    _logs.push({
      message: "Truy v???n gi?? tr??? ng???u nhi??n t??? d???ch v??? Orand ...",
    });
    try {
      setFormatedEpochData(undefined);
      setEpochData(undefined);
      setIsRolling(true);
      DICE_IDs.forEach((dice) => {
        const diceElement: any = document.getElementById(dice);
        diceElement.style.animation = 'rolling 2s 100';
      });
      const fetchResult = await fetch(
        'https://orand-test-service.orochi.network',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: '{"method":"orand_newPrivateEpoch","params":["56", "0x68bE199e497FAe7ed11339BE388BF4a403CD1698"]}',
        }
      );
      fetchResult.json().then((rollResult) => {
        if (rollResult) {
          const _epochData = JSON.parse(JSON.stringify(rollResult));
          _logs.push({
            message: `Nh???n ???????c gi?? tr??? ng???u nhi??n y = 0x${_epochData.y}`,
            timeToShow: 1000,
          });
          setEpochData(_epochData);
        }
      });
    } catch (error) {
      DICE_IDs.forEach((dice) => {
        const diceElement: any = document.getElementById(dice);
        diceElement.style.animation = 'none';
      });
      setIsRolling(false);
      setLogs(
        logs.concat({
          message: 'There are some error, please try again',
        })
      );
    }
  };

  const moveLogToBottom = () => {
    // do nothing
  }

  const getDiceNameByNumber = (number: number) => {
    switch (number) {
      case 1:
        return 'H????u';
      case 2:
        return 'Cua';
      case 3:
        return 'C??';
      case 4:
        return 'G??';
      case 5:
        return 'T??m';
      case 6:
        return 'B???u';
      default:
        return;
    }
  };

  useEffect(() => {
    const getLatestData = async () => {
      const fetchResult = await fetch(
        'https://orand-test-service.orochi.network',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: '{"method":"orand_newPrivateEpoch","params":["56", "0x68bE199e497FAe7ed11339BE388BF4a403CD1698"]}',
        }
      );
      fetchResult.json().then((rollResult) => {
        if (rollResult) {
          const _epochData = JSON.parse(JSON.stringify(rollResult));
          setLatestData(_epochData);
        }
      });
    };
    getLatestData();
  }, []);

  useEffect(() => {
    let _logs = logs;
    if (epochData) {
      const lastEight = epochData.y.substring(epochData.y.length - 8);
      const nextLastEight = epochData.y.substring(
        epochData.y.length - 8,
        epochData.y.length - 16
      );
      const finalLastEight = epochData.y.substring(
        epochData.y.length - 16,
        epochData.y.length - 24
      );
      _logs.push({
        message: `a = 0x${lastEight}, b = 0x${nextLastEight}, c = 0x${finalLastEight}`,
        timeToShow: 4000,
      });
      _logs.push({
        message: `T??ch bi???n ?????c l???p:`,
        timeToShow: 4000
      });
      const _firstDice = new BigNumber(`0x${lastEight}`).mod(6).plus(1);
      const _secondDice = new BigNumber(`0x${nextLastEight}`).mod(6).plus(1);
      const _thirdDice = new BigNumber(`0x${finalLastEight}`).mod(6).plus(1);

      _logs.push({
        message: `(0x${lastEight} % 6) + 1 = ${_firstDice.toString()} (${getDiceNameByNumber(_firstDice.toNumber())})`,
        timeToShow: 6000
      });
      _logs.push({
        message: `(0x${nextLastEight} % 6) + 1 = ${_secondDice.toString()} (${getDiceNameByNumber(_secondDice.toNumber())})`,
        timeToShow: 6000
      });
      _logs.push({
        message: `(0x${finalLastEight} % 6) + 1 = ${_thirdDice.toString()} (${getDiceNameByNumber(_thirdDice.toNumber())})`,
        timeToShow: 6000
      });
      _logs.push({
        message: `T??nh to??n k???t qu???:`,
        timeToShow: 6000
      });
      setLogs(_logs);

      setTimeout(() => {
        rollDice(_firstDice.toNumber(), DICE_IDs[0]);
        rollDice(_secondDice.toNumber(), DICE_IDs[1]);
        rollDice(_thirdDice.toNumber(), DICE_IDs[2]);
      }, 7000)

      setFormatedEpochData({
        'Gamma.X': epochData.gamma.substring(0, 64),
        'Gamma.Y': epochData.gamma.substring(64, 128),
        c: epochData.c,
        s: epochData.s,
        y: epochData.y,
      });
    }
  }, [epochData, logs]);

  useEffect(() => {
    const _logs: Log[] = [];
    if (latestData) {
      _logs.push({
        message: "Truy v???n gi?? tr??? ng???u nhi??n t??? d???ch v??? Orand ...",
      });
      _logs.push({
        message: `Nh???n ???????c gi?? tr??? ng???u nhi??n y = 0x${latestData.y}`,
      });
      const lastEight = latestData.y.substring(latestData.y.length - 8);
      const nextLastEight = latestData.y.substring(
        latestData.y.length - 8,
        latestData.y.length - 16
      );
      const finalLastEight = latestData.y.substring(
        latestData.y.length - 16,
        latestData.y.length - 24
      );
      _logs.push({
        message: `a = 0x${lastEight}, b = 0x${nextLastEight}, c = 0x${finalLastEight}`,
      });
      _logs.push({
        message: `T??ch bi???n ?????c l???p:`,
      });
      const _firstDice = new BigNumber(`0x${lastEight}`).mod(6).plus(1);
      const _secondDice = new BigNumber(`0x${nextLastEight}`).mod(6).plus(1);
      const _thirdDice = new BigNumber(`0x${finalLastEight}`).mod(6).plus(1);
      _logs.push({
        message: `(0x${lastEight} % 6) + 1 = ${_firstDice.toString()} (${getDiceNameByNumber(
          _firstDice.toNumber()
        )})`,
      });
      _logs.push({
        message: `(0x${nextLastEight} % 6) + 1 = ${_secondDice.toString()} (${getDiceNameByNumber(
          _secondDice.toNumber()
        )})`,
      });
      _logs.push({
        message: `(0x${finalLastEight} % 6) + 1 = ${_thirdDice.toString()} (${getDiceNameByNumber(
          _thirdDice.toNumber()
        )})`,
      });
      _logs.push({
        message: `T??nh to??n k???t qu???:`,
      });
      setNoDelayLogs(_logs);
      setFormatedEpochData({
        'Gamma.X': latestData.gamma.substring(0, 64),
        'Gamma.Y': latestData.gamma.substring(64, 128),
        c: latestData.c,
        s: latestData.s,
        y: latestData.y,
      });
      rollDice(_firstDice.toNumber(), DICE_IDs[0]);
      rollDice(_secondDice.toNumber(), DICE_IDs[1]);
      rollDice(_thirdDice.toNumber(), DICE_IDs[2]);
    }
  }, [latestData]);

  return (
    <div className="wrapper">
      <div className="container">
        <div className="left-contain">
          <div className="dice-contain">
            <div className="dice-wrapper">
              {DICE_IDs.map((item: string, idx: number) => {
                return <Dice key={idx} id={`${item}`} />;
              })}
            </div>
            <button className="roll" onClick={handleRoll} disabled={isRolling}>
              L???c B???u Cua
            </button>
            <div>
              <img className="tooltip-icon" src={questionIcon} alt={'More Info'} onClick={handleOpenDialog}/>
              <Dialog
                open={openDialog}
                keepMounted
                onClose={handleCloseDialog}
                aria-describedby="alert-dialog-slide-description"
              >
                <ContentDialog>
                  <ContentText>
                    B???u cua kh??ng "c??i"
                  </ContentText>
                  <ContentText>
                    S??t ph???t ?????u n??m: vui
                  </ContentText>
                  <ContentText>
                    Anh em t??nh th??n: t??ng
                  </ContentText>
                  <ContentText>
                    T???i v??? nh?? c??i: g??nh
                  </ContentText>
                  <ContentText>
                    Kh??ng c?? n??m n??o nh?? c??i ko mang ti???ng l???c kh??ng thi??ng, l???c d???m, thi??n v??? ng?????i n??y ng?????i n???. N??m nay, nh?? c??i "d???i" b??? cu???c ch??i, ????? v??n b???u cua ho??n to??n d??n ch??? v???i gi???i ph??p s??? ng???u nhi??n c?? th??? ki???m ch???ng s??? d???ng c??ng ngh??? blockchain. ??p ch??n xu???ng, ra con g??? Kh??ng m???t ai bi???t ????
                  </ContentText>
                  <ContentText>
                    Th??? ngay ??i th??i!!
                  </ContentText>
                  <PlayNowButton variant="outlined" className="btn-play" onClick={handleCloseDialog}>Ch??i Th??i</PlayNowButton>
                </ContentDialog>
              </Dialog>
            </div>
          </div>
          <div className="epoch">
            {!isShowingLatestData ? (
              <h2>{`D??? li???u c???a k??? nguy??n ${epochData ? epochData.epoch : 'N/A'}:`}</h2>
            ) : (
              <h2>{`D??? li???u c???a k??? nguy??n ${latestData ? latestData.epoch : 'N/A'}:`}</h2> 
            )}
            <div className="epoch-content">
              {formatedEpochData &&
                Object.keys(formatedEpochData).map((element: string, index: number) => {
                  return (
                    <div key={index} className="item">
                      <div className="title">{element}:</div>
                      <div className="content">
                        {!isShowingLatestData ? (
                          <RandomReveal
                            isPlaying
                            duration={3}
                            revealDuration={1}
                            characterSet={hexRandomCharacterSet}
                            characters={formatedEpochData[
                              element as keyof FormatedEpochData
                            ].toString()}
                          />
                        ) : (
                          <div>
                            {formatedEpochData[
                              element as keyof FormatedEpochData
                            ].toString()}
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  }
                )}
            </div>
          </div>
        </div>
        <div className="log">
          <h2>Th??ng tin</h2>
          <div className="log-wrapper">
            <div id="log-content" className="log-content">
              {noDelayLogs.length > 0 && 
                noDelayLogs.map((log, index) => {
                  return <div key={index}>{log.message}</div>;
                })}
              {logs.length > 0 &&
                logs.map((log, index) => {
                  if (log.isAnimate) {
                    return (
                      <Delayed
                        key={index}
                        waitBeforeShow={log.timeToShow}
                        moveLogToBottom={moveLogToBottom}
                      >
                        <RandomReveal
                          isPlaying
                          duration={3}
                          revealDuration={1.6}
                          characterSet={hexRandomCharacterSet}
                          characters={log.message}
                        />
                      </Delayed>
                    );
                  } else {
                    return (
                      <Delayed
                        key={index}
                        waitBeforeShow={log.timeToShow}
                        moveLogToBottom={moveLogToBottom}
                      >
                        {log.message}
                      </Delayed>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

const ContentText = styled(DialogContentText)`
  color: white;
`;

const ContentDialog = styled(DialogContent)`
  position: relative;
  background-color: #0f1f3e;
  display: flex;
  flex-direction: column;
`;

const PlayNowButton = styled(Button)`
  color: #b33951;
  border-color: #b33951;
  background-color: white;
  align-self: center;
  text-transform: none;
  :hover {
    background-color: #b33951;
    border-color: #b33951;
    color: white;
  }
`;
