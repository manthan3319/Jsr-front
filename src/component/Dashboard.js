import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import shoppingcarticon from "../assert/images/shopping-cart.svg";
import featuresiocn from "../assert/images/flash.svg";
import user2icon from "../assert/images/profile-2user.svg";
import downmaketicon from "../assert/images/downmarketarrow.svg";
import upmarketicon from "../assert/images/upmarketarrow.svg";
import doloricon from "../assert/images/dollar-circle.svg";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { ethers } from "ethers";
import { UsdtContract, usdt_abi } from "./usdt.js";
import Loader from "../assert/images/loder.svg"
import {
  ConnectWallet,
  useSDK,
  useTokenBalance,
  useContract,
  useAddress,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { stakecontract, stake_abi } from "./contract.js";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {

  // walletadress get
  const walletAddress = useAddress();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract2 = new ethers.Contract(
    stakecontract,
    stake_abi,
    provider
  );


  const [capitalValue, setCapitalValue] = useState("");
  const [levelValue, setLevelValue] = useState("");
  const [showAllDirectChild, setshowAllDirectChild] = useState("");
  const [showAllInDirectChild, setshowAllInDirectChild] = useState("");
  const [updateLevelIncome, setupdateLevelIncome] = useState("");

  async function getCapital() {
    const data = await contract2.checkRewards(walletAddress);
    setCapitalValue(ethers.utils.formatUnits(data));

  }


  async function getLevel() {
    const data = await contract2.parent(walletAddress);
    setLevelValue(data);
  }

  async function ShowAllDirectChild() {
    const data = await contract2.showAllDirectChild(walletAddress);
    setshowAllDirectChild(data.length);

  }

  async function ShowAllInDirectChild() {
    const data = await contract2.showAllInDirectChild(walletAddress);
    setshowAllInDirectChild(data.length);

  }

  async function UpdateLevelIncome() {
    const data = await contract2.updateLevelIncome(walletAddress);
    setupdateLevelIncome(ethers.utils.formatUnits(data));

  }


  useEffect(() => {
    getCapital();
    getLevel();
    ShowAllDirectChild();
    ShowAllInDirectChild();
    UpdateLevelIncome();
  }, []);


  /***************************Total rewad code start ***************************/
  const [stackamouttotal, setstackamouttotal] = useState('');
  const [totalUsrWithdrwalRewardAmount, setotalUsrWithdrwalRewardAmount] = useState('');
  const [totalLimit, settotalLimit] = useState('');
  const [totalTeamCount, settotalTeamCount] = useState('');
  const [teamLevel, setteamLevel] = useState('');

  const StackAmountGet = () => {
    try {
      fetch(`${BASE_URL}/api/v1/user/rewardAmountList`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: walletAddress
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // console.log("StackAmountGet", data);
          setstackamouttotal(data.data.totalRewardAmount);
          setotalUsrWithdrwalRewardAmount(data.data.totalUsrWithdrwalRewardAmount)
          settotalLimit(data.data.totalLimit)
          settotalTeamCount(data.data.totalTeamcount)
          setteamLevel(data.data.teamLevel);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  useEffect(() => {
    StackAmountGet();
  }, []);

  /*************************** 25% stack btn code start ***************************/
  const [referralAddress25, setReferralAddress25] = useState('');
  const [loading, setLoading] = useState(false);

  const ButtonStake25 = () => {


    fetch(`${BASE_URL}/api/v1/user/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        amount: '25',
        percentage: '0.5',
        duration: '300 Days',
        limit: '75$',
        referralAddress: referralAddress25
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.statusCode === 200) {
          stack25Amounttost();
        } else {
          console.log("data not insert")
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const stack25Amounttost = () => {
    toast("You have successfully purchased the plan!", {
      toastStyle: { background: "green", color: "white" }, // Example custom styles
      toastClassName: "custom-toast" // Example custom class name
    });
  };

  const buyToken25 = async () => {
    setLoading(true); // Set loading state to true before initiating the transaction

    try {
      let tierplan = ethers.utils.parseEther("25");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stakecontract, stake_abi, signer);

      // Specify a gas limit manually
      const overrides = {
        gasLimit: 300000 // You can adjust this gas limit as needed
      };

      // Initiate the token deposit transaction
      const token = await contract.deposit(tierplan.toString(), referralAddress25, overrides);

      // Wait for the transaction receipt
      const receipt = await token.wait();

      // Check if the receipt status is 1 (successful transaction)
      if (receipt.status === 1) {
        ButtonStake25(); // Execute the ButtonStake25 function if the transaction is successful
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed!", {
        toastStyle: { background: "green", color: "white" }, // Example custom styles
        toastClassName: "custom-toast" // Example custom class name
      });
    }

   
    setLoading(false);
  };
  /*************************** 50% stack btn code start ***************************/
  const [referralAddress50, setReferralAddress50] = useState('');

  const ButtonStake50 = () => {
 

    fetch(`${BASE_URL}/api/v1/user/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        amount: '50',
        percentage: '0.75',
        duration: '300 Days',
        limit: '75$',
        referralAddress: referralAddress50
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.statusCode === 200) {
          //console.log("data insert"); 
          stack50Amounttost(); // Call the notify function
        } else {
          console.log("data not insert")
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const stack50Amounttost = () => {
    toast("You have successfully purchased the plan!", {
      toastStyle: { background: "green", color: "white" }, // Example custom styles
      toastClassName: "custom-toast" // Example custom class name
    });
  };

  const buyToken50 = async () => {
    setLoading(true); // Set loading state to true before initiating the transaction

    try {
      let tierplan = ethers.utils.parseEther("50");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stakecontract, stake_abi, signer);

      // Specify a gas limit manually
      const overrides = {
        gasLimit: 500000 // You can adjust this gas limit as needed
      };

      // Initiate the token deposit transaction
      const token = await contract.stakeTokens(tierplan.toString(), referralAddress50, overrides);

      // Wait for the transaction receipt
      const receipt = await token.wait();

      // Check if the receipt status is 1 (successful transaction)
      if (receipt.status === 1) {
        ButtonStake50(); // Execute the ButtonStake25 function if the transaction is successful
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed!", {
        toastStyle: { background: "green", color: "white" }, // Example custom styles
        toastClassName: "custom-toast" // Example custom class name
      });
    }

    // Regardless of success or failure, set the loading state to false after completing the transaction
    setLoading(false);
  };

  /*************************** 100% stack btn code start ***************************/
  const [referralAddress100, setReferralAddress100] = useState('');

  const ButtonStake100 = () => {
   
    fetch(`${BASE_URL}/api/v1/user/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        amount: '100',
        percentage: '1',
        duration: '400 Days',
        limit: '75$',
        referralAddress: referralAddress100
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.statusCode === 200) {
          //console.log("data insert"); //
          stack100Amounttost(); // Call the notify function
        } else {
          console.log("data not insert")
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const stack100Amounttost = () => {
    toast("You have successfully purchased the plan!", {
      toastStyle: { background: "green", color: "white" }, // Example custom styles
      toastClassName: "custom-toast" // Example custom class name
    });
  };

  const buyToken100 = async () => {
    setLoading(true); // Set loading state to true before initiating the transaction

    try {
      let tierplan = ethers.utils.parseEther("100");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stakecontract, stake_abi, signer);

      // Specify a gas limit manually
      const overrides = {
        gasLimit: 500000 // You can adjust this gas limit as needed
      };

      // Initiate the token deposit transaction
      const token = await contract.stakeTokens(tierplan.toString(), referralAddress100, overrides);

      // Wait for the transaction receipt
      const receipt = await token.wait();

      // Check if the receipt status is 1 (successful transaction)
      if (receipt.status === 1) {
        ButtonStake100(); // Execute the ButtonStake25 function if the transaction is successful
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed!", {
        toastStyle: { background: "green", color: "white" }, // Example custom styles
        toastClassName: "custom-toast" // Example custom class name
      });
    }

    // Regardless of success or failure, set the loading state to false after completing the transaction
    setLoading(false);
  };

  /*************************** 500% stack btn code start ***************************/
  const [referralAddress500, setReferralAddress500] = useState('');

  const ButtonStake500 = () => {
    const referralAddressValue500 = document.querySelector('.referralAddress_sec3_inputfild').value;

    fetch(`${BASE_URL}/api/v1/user/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        amount: '500',
        percentage: '1.25',
        duration: '400 Days',
        limit: '75$',
        referralAddress: referralAddress500
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.statusCode === 200) {
          //console.log("data insert"); //
          stack500Amounttost(); // Call the notify function
        } else {
          console.log("data not insert")
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const stack500Amounttost = () => {
    toast("You have successfully purchased the plan!", {
      toastStyle: { background: "green", color: "white" }, // Example custom styles
      toastClassName: "custom-toast" // Example custom class name
    });
  };

  const buyToken500 = async () => {
    setLoading(true); // Set loading state to true before initiating the transaction

    try {
      let tierplan = ethers.utils.parseEther("500");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stakecontract, stake_abi, signer);

      // Specify a gas limit manually
      const overrides = {
        gasLimit: 300000 // You can adjust this gas limit as needed
      };

      // Initiate the token deposit transaction
      const token = await contract.deposit(tierplan.toString(), referralAddress500, overrides);

      // Wait for the transaction receipt
      const receipt = await token.wait();

      // Check if the receipt status is 1 (successful transaction)
      if (receipt.status === 1) {
        ButtonStake500(); // Execute the ButtonStake25 function if the transaction is successful
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed!", {
        toastStyle: { background: "green", color: "white" }, // Example custom styles
        toastClassName: "custom-toast" // Example custom class name
      });
    }

    // Regardless of success or failure, set the loading state to false after completing the transaction
    setLoading(false);
  };

  /*************************** 1000% stack btn code start ***************************/
  const [referralAddress1000, setReferralAddress1000] = useState('');

  const ButtonStake1000 = () => {
    const referralAddressValue1000 = document.querySelector('.referralAddress_sec3_inputfild').value;

    fetch(`${BASE_URL}/api/v1/user/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        amount: '1000',
        percentage: '1.50',
        duration: '400 Days',
        limit: '75$',
        referralAddress: referralAddress1000
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.statusCode === 200) {
          //console.log("data insert"); //
          stack1000Amounttost(); // Call the notify function
        } else {
          console.log("data not insert")
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const stack1000Amounttost = () => {
    toast("You have successfully purchased the plan!", {
      toastStyle: { background: "green", color: "white" }, // Example custom styles
      toastClassName: "custom-toast" // Example custom class name
    });
  };

  const buyToken1000 = async () => {
    setLoading(true); // Set loading state to true before initiating the transaction

    try {
      let tierplan = ethers.utils.parseEther("1000");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stakecontract, stake_abi, signer);

      // Specify a gas limit manually
      const overrides = {
        gasLimit: 300000 // You can adjust this gas limit as needed
      };

      // Initiate the token deposit transaction
      const token = await contract.deposit(tierplan.toString(), referralAddress1000, overrides);

      // Wait for the transaction receipt
      const receipt = await token.wait();

      // Check if the receipt status is 1 (successful transaction)
      if (receipt.status === 1) {
        ButtonStake1000(); // Execute the ButtonStake25 function if the transaction is successful
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed!", {
        toastStyle: { background: "green", color: "white" }, // Example custom styles
        toastClassName: "custom-toast" // Example custom class name
      });
    }

    // Regardless of success or failure, set the loading state to false after completing the transaction
    setLoading(false);
  };

  /*************************** 5000% stack btn code start ***************************/
  const [referralAddress5000, setReferralAddress5000] = useState('');

  const ButtonStake5000 = () => {
    const referralAddressValue5000 = document.querySelector('.referralAddress_sec3_inputfild').value;

    fetch(`${BASE_URL}/api/v1/user/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        amount: '5000',
        percentage: '1.75',
        duration: '400 Days',
        limit: '75$',
        referralAddress: referralAddress5000
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.statusCode === 200) {
          //console.log("data insert"); //
          stack5000Amounttost(); // Call the notify function
        } else {
          console.log("data not insert")
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  const stack5000Amounttost = () => {
    toast("You have successfully purchased the plan!", {
      toastStyle: { background: "green", color: "white" }, // Example custom styles
      toastClassName: "custom-toast" // Example custom class name
    });
  };

  const buyToken5000 = async () => {
    setLoading(true); // Set loading state to true before initiating the transaction

    try {
      let tierplan = ethers.utils.parseEther("5000");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stakecontract, stake_abi, signer);

      // Specify a gas limit manually
      const overrides = {
        gasLimit: 900000 // You can adjust this gas limit as needed
      };

      // Initiate the token deposit transaction
      const token = await contract.deposit(tierplan.toString(), referralAddress5000, overrides);

      // Wait for the transaction receipt
      const receipt = await token.wait();

      // Check if the receipt status is 1 (successful transaction)
      if (receipt.status === 1) {
        ButtonStake5000(); // Execute the ButtonStake25 function if the transaction is successful
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed!", {
        toastStyle: { background: "green", color: "white" }, // Example custom styles
        toastClassName: "custom-toast" // Example custom class name
      });
    }

    // Regardless of success or failure, set the loading state to false after completing the transaction
    setLoading(false);
  };

  /*************************** 10000% stack btn code start ***************************/
  const [referralAddress10000, setReferralAddress10000] = useState('');

  const ButtonStake10000 = () => {
    const referralAddressValue10000 = document.querySelector('.referralAddress_sec3_inputfild').value;

    fetch(`${BASE_URL}/api/v1/user/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: walletAddress,
        amount: '10000',
        percentage: '2',
        duration: '400 Days',
        limit: '75$',
        referralAddress: referralAddress10000
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (data.statusCode === 200) {
          //console.log("data insert"); //
          stack10000Amounttost(); // Call the notify function
        } else {
          console.log("data not insert")
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };
  const stack10000Amounttost = () => {
    toast("You have successfully purchased the plan!", {
      toastStyle: { background: "green", color: "white" }, // Example custom styles
      toastClassName: "custom-toast" // Example custom class name
    });
  };

  const buyToken10000 = async () => {
    setLoading(true); // Set loading state to true before initiating the transaction

    try {
      let tierplan = ethers.utils.parseEther("10000");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stakecontract, stake_abi, signer);

      // Specify a gas limit manually
      const overrides = {
        gasLimit: 300000 // You can adjust this gas limit as needed
      };

      // Initiate the token deposit transaction
      const token = await contract.deposit(tierplan.toString(), referralAddress10000, overrides);

      // Wait for the transaction receipt
      const receipt = await token.wait();

      // Check if the receipt status is 1 (successful transaction)
      if (receipt.status === 1) {
        ButtonStake10000(); // Execute the ButtonStake25 function if the transaction is successful
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed!", {
        toastStyle: { background: "green", color: "white" }, // Example custom styles
        toastClassName: "custom-toast" // Example custom class name
      });
    }

    // Regardless of success or failure, set the loading state to false after completing the transaction
    setLoading(false);
  };
  /*************************** withthrowalamount ***************************/
  const [withdrawalamount, setwiththrowalamount] = useState('');

  const withthrowalamountBtn = () => {
    try {
      fetch(`${BASE_URL}/api/v1/user/withdrawalAmount`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: walletAddress,
          amount: withdrawalamount
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log("widtrwaldata", data.data.messages);
          toast(data.data.messages);

        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    } catch (error) {
      console.error('There was an error:', error);
    }
  };


  const withdrawalAmountMain = async () => {
    setLoading(true); // Set loading state to true before initiating the transaction

    try {
      let RewardAmount = ethers.utils.parseEther(withdrawalamount);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(stakecontract, stake_abi, signer);

      // Specify a gas limit manually
      const overrides = {
        gasLimit: 800000 // You can adjust this gas limit as needed
      };

      // Initiate the token deposit transaction
      // const token = await contract.deposit(RewardAmount, referralAddress25, overrides);
      const token = await contract.withdrawRewards(RewardAmount, overrides);

      // Wait for the transaction receipt
      const receipt = await token.wait();

      // Check if the receipt status is 1 (successful transaction)
      if (receipt.status === 1) {
        withthrowalamountBtn(); // Execute the ButtonStake25 function if the transaction is successful
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed!", {
        toastStyle: { background: "green", color: "white" }, // Example custom styles
        toastClassName: "custom-toast" // Example custom class name
      });
    }

    // Regardless of success or failure, set the loading state to false after completing the transaction
    setLoading(false);
  };



  /***************************Totals url code***************************/
  const location = useLocation();

  const [amount2, setamount2] = useState('');
  const [walletAddress2, setwalletAddress2] = useState('');
  const [percentage2, setpercentage2] = useState('');
  const [duration2, setduration2] = useState('');
  const [limit2, setlimit2] = useState('');
  const [referralAddress2, setreferralAddress2] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('walletAddress')) {
      const walletAddress = urlParams.get('walletAddress');
      setwalletAddress2(walletAddress);
    }

    if (urlParams.has('amount')) {
      const amount = urlParams.get('amount');
      setamount2(amount);
    }

    if (urlParams.has('percentage')) {
      const percentage = urlParams.get('percentage');
      setpercentage2(percentage);
    }

    if (urlParams.has('duration')) {
      const duration = urlParams.get('duration');
      setduration2(duration);
    }

    if (urlParams.has('limit')) {
      const limit = urlParams.get('limit');
      setlimit2(limit);
    }

    if (urlParams.has('referralAddress')) {
      const referralAddress = urlParams.get('referralAddress');
      setreferralAddress2(referralAddress);
    }
  }, [location.search]);

  useEffect(() => {
    if (walletAddress2) {
      UrlbtnStacks();
    }
  }, [walletAddress2]);

  const UrlbtnStacks = () => {
    fetch(`${BASE_URL}/api/v1/user/add`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: walletAddress2,
        amount: amount2,
        percentage: percentage2,
        duration: duration2,
        limit: limit2,
        referralAddress: referralAddress2
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // console.log(data);
        if (data.statusCode === 200) {
          console.log("...");
        } else {
          console.log("....")
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };




  /*************************** Approve btn code ***************************/
  const [approveAmt, setApproveAmt] = useState("");
  const [BuyTokenLoading, setBuyTokenLoading] = useState(false);

  const approveTokens = async () => {
    setLoading(true);
    try {
      let spender = "0xe439fb7591fac900d1082652567E32A2Af902f7D"; //contract address
      let approveAmount = ethers.utils.parseEther(approveAmt);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(UsdtContract, usdt_abi, signer);
      console.log(contract);
      const token = await contract.approve(spender, approveAmount.toString(), {
        gasLimit: 80000,
      });
      console.log(token);
      const receipt = await token.wait();

      if (receipt.status === 1) {
        toast.success("Successfully approved tokens!");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed");
    }
  };





  return (
    <React.Fragment>
      <div className='loder_backgroung'>
        {loading && ( // Conditional rendering of loader based on loading state
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#272A30",
          }}>
            <img src={Loader} alt="Loader" className='loderImgesection' />
          </div>
        )}
      </div>
      {!loading && (
        <div className="content">
          <div className="container">
            <div className="dashbord_connect_btn">
              <div className="dashbord_connect_btn_left">
                <h3>Dashboard</h3>
                <p>see your account information in here!</p>
              </div>

              <div className="dashbord_connect_btn_right">
                <ConnectWallet />
              </div>
            </div>

            <div className="deshborde_section2_main">
              <div className="section2_left">
                <h2>Approve USDT</h2>

                <p>
                  Approve USDT to spend on JSR
                  staking contract
                </p>

                <input
                  type="number"
                  name="referralAddress25"
                  className="referralAddress_sec3_inputfild"
                  placeholder='Enter Amount'
                  value={approveAmt}
                  onChange={(e) => {
                    setApproveAmt(e.target.value);
                  }}
                />

                <Link >
                  {/* <span>
                  <img
                    src={shoppingcarticon}
                    alt="shoppingcarticon"
                    className="shoppingcarticon"
                  />
                </span> */}
                  <span className="little_title" onClick={approveTokens}>Approve USDT</span>
                </Link>
              </div>

              <div className="section2_right">
                <div className='TeamLevel TeamLevel2'>
                  <h3>Total Rewards</h3>
                  {/* {teamLevel + 0 || 0} */}
                  <p>${(Math.round(capitalValue * 100) / 100).toFixed(2) || '0.00'}</p>
                </div>

                <div className='TeamLevel'>
                  <h3>Total Team</h3>
                  {/* {totalTeamCount || 0} */}
                  <p>${(showAllInDirectChild + 1) || 0}</p>
                </div>
              </div>

              <div className="section2_right">
                <div className='TeamLevel TeamLevel2'>
                  <h3>Direct Team</h3>
                  <p>{showAllDirectChild || 0}</p>
                </div>

                <div className='TeamLevel'>
                  <h3>Level Income</h3>
                  <p>${(updateLevelIncome) || '0.00'}</p>
                </div>
              </div>

              <div className="section2_right">
                <div className='TeamLevel TeamLevel2'>
                  <h3>Withdrawal Limit</h3>
                  <p>${teamLevel + 0 || '0.00'}</p>
                </div>

                <div className='TeamLevel'>
                  <h3>Total Team</h3>
                  <p>{totalTeamCount || 0}</p>
                </div>
              </div>
            </div>
            <div className="seven_box_dashboard">
              {/* <div className="section3_card section3_cardw2" >
                <div className="section3_card_top_section">
                  <h4>
                    
                    25$
                  </h4>
                  <h5>
                    {" "}
                    <span>
                      
                    </span>
                    Daily 0.5%
                  </h5>
                </div>

                <div className="section3_card_last_section">
                  <div className="section3_card_last_section_left">
                    <p className="text-red-500"><b>300</b> days </p>
                    <p className="text-red-500">Stake Amount <b>25$</b> </p>
                  
                    <input
                      type="text"
                      name="referralAddress25"
                      className="referralAddress_sec3_inputfild"
                      placeholder='Enter referral address'
                      onChange={e => setReferralAddress25(e.target.value)}
                    />

                  </div>

                  <div className="section3_card_last_section_right">
                    <Link onClick={buyToken25}>Stake</Link>
                  </div>
                </div>
              </div> */}

              <div className="section3_card">
                <div className="section3_card_top_section">
                  <h4>
                    50$
                  </h4>
                  <h5>
                    {" "}
                    <span>
                      {/* <img
                      src={upmarketicon}
                      alt="downmaketicon"
                      className="downmaketicon"
                    /> */}
                    </span>
                    Daily 0.75%
                  </h5>
                </div>

                <div className="section3_card_last_section">
                  <div className="section3_card_last_section_left">
                    <p className="text-red-500"><b>300</b> days </p>
                    <p className="text-red-500">Stake Amount <b>50$</b> </p>
                    <input
                      type="text"
                      name="referralAddress25"
                      className="referralAddress_sec3_inputfild"
                      onChange={e => setReferralAddress50(e.target.value)}
                      placeholder='Enter referral address'
                    />

                  </div>

                  <div className="section3_card_last_section_right">
                    <Link onClick={buyToken50} >Stake</Link>
                  </div>
                </div>
              </div>

              <div className="section3_card">
                <div className="section3_card_top_section">
                  <h4>
                    100$
                  </h4>
                  <h5>
                    {" "}
                    <span>
                      {/* <img
                      src={upmarketicon}
                      alt="downmaketicon"
                      className="downmaketicon"
                    /> */}
                    </span>
                    Daily 1%
                  </h5>
                </div>

                <div className="section3_card_last_section">
                  <div className="section3_card_last_section_left">
                    <p className="text-red-500"><b>400</b> days </p>
                    <p className="text-red-500">Stake Amount <b>100$</b> </p>
                    <input
                      type="text"
                      name="referralAddress25"
                      className="referralAddress_sec3_inputfild"
                      onChange={e => setReferralAddress100(e.target.value)}
                      placeholder='Enter referral address'
                    />

                  </div>

                  <div className="section3_card_last_section_right">
                    <Link onClick={buyToken100} >Stake</Link>
                  </div>
                </div>
              </div>
              <div className="section3_card">
                <div className="section3_card_top_section">
                  <h4>
                    500$
                  </h4>
                  <h5>
                    {" "}
                    {/* <span>
                    <img
                      src={downmaketicon}
                      alt="downmaketicon"
                      className="downmaketicon"
                    />
                  </span> */}
                    Daily 1.25%
                  </h5>
                </div>

                <div className="section3_card_last_section">
                  <div className="section3_card_last_section_left">
                    <p className="text-red-500"><b>400</b> days </p>

                    <p className="text-red-500">Stake Amount <b>500$</b> </p>
                    <input
                      type="text"
                      name="referralAddress25"
                      className="referralAddress_sec3_inputfild"
                      onChange={e => setReferralAddress500(e.target.value)}
                      placeholder='Enter referral address'
                    />

                  </div>

                  <div className="section3_card_last_section_right">
                    <Link onClick={buyToken500} >Stake</Link>
                  </div>
                </div>
              </div>

              <div className="section3_card">
                <div className="section3_card_top_section">
                  <h4>
                    1000$
                  </h4>
                  <h5>
                    {" "}
                    {/* <span>
                    <img
                      src={upmarketicon}
                      alt="downmaketicon"
                      className="downmaketicon"
                    />
                  </span> */}
                    Daily 1.50%
                  </h5>
                </div>

                <div className="section3_card_last_section">
                  <div className="section3_card_last_section_left">
                    <p className="text-red-500"><b>400</b> days </p>

                    <p className="text-red-500">Stake Amount <b>1000$</b> </p>
                    <input
                      type="text"
                      name="referralAddress25"
                      className="referralAddress_sec3_inputfild"
                      onChange={e => setReferralAddress1000(e.target.value)}
                      placeholder='Enter referral address'
                    />

                  </div>

                  <div className="section3_card_last_section_right">
                    <Link onClick={buyToken1000} >Stake</Link>
                  </div>
                </div>
              </div>

              <div className="section3_card">
                <div className="section3_card_top_section">
                  <h4>
                    5000$
                  </h4>
                  <h5>
                    {" "}
                    {/* <span>
                    <img
                      src={upmarketicon}
                      alt="downmaketicon"
                      className="downmaketicon"
                    />
                  </span> */}
                    Daily 1.75%
                  </h5>
                </div>

                <div className="section3_card_last_section">
                  <div className="section3_card_last_section_left">
                    <p className="text-red-500"><b>400</b> days </p>

                    <p className="text-red-500">Stake Amount <b>5000$</b> </p>
                    <input
                      type="text"
                      name="referralAddress25"
                      className="referralAddress_sec3_inputfild"
                      onChange={e => setReferralAddress5000(e.target.value)}
                      placeholder='Enter referral address'
                    />

                  </div>

                  <div className="section3_card_last_section_right">
                    <Link onClick={buyToken5000} >Stake</Link>
                  </div>
                </div>
              </div>

              <div className="section3_card">
                <div className="section3_card_top_section">
                  <h4>
                    10000$
                  </h4>
                  <h5>
                    {" "}
                    {/* <span>
                    <img
                      src={upmarketicon}
                      alt="downmaketicon"
                      className="downmaketicon"
                    />
                  </span> */}
                    Daily 2%
                  </h5>
                </div>

                <div className="section3_card_last_section">
                  <div className="section3_card_last_section_left">
                    <p className="text-red-500"><b>400</b> days </p>

                    <p className="text-red-500">Stake Amount <b>10000$</b> </p>
                    <input
                      type="text"
                      name="referralAddress25"
                      className="referralAddress_sec3_inputfild"
                      onChange={e => setReferralAddress10000(e.target.value)}
                      placeholder='Enter referral address'
                    />

                  </div>

                  <div className="section3_card_last_section_right">
                    <Link onClick={buyToken10000} >Stake</Link>
                  </div>
                </div>
              </div>

              <div className="section3_card">
                {/* <div className="section3_card_top_section">
                <h4>
                  <img src={user2icon} alt="user2icon" className="user2icon" />
                </h4>
                <h5>
                  {" "}
                  <span>
                    <img
                      src={upmarketicon}
                      alt="downmaketicon"
                      className="downmaketicon"
                    />
                  </span>
                  2.5%
                </h5>
              </div> */}

                <div className="section3_card_last_section">
                  <div className="section3_card_last_section_left">
                    <p className="text-red-500">Rewards : ${(Math.round(stackamouttotal * 100) / 100 || 0).toFixed(2)}</p>
                    <p className="text-red-500">Rewards withdrawn: ${(Math.round(totalUsrWithdrwalRewardAmount * 100) / 100 || 0).toFixed(2)}</p>
                    <p className="text-red-500">Limit : ${totalLimit || 0} </p>
                    <input
                      type="text"
                      name="referralAddress25"
                      className="referralAddress_sec3_inputfild"
                      onChange={e => setwiththrowalamount(e.target.value)}
                      placeholder='Enter Withdrawable amount'

                    />

                  </div>

                  <div className="section3_card_last_section_right">
                    <Link  onClick={withdrawalAmountMain} >Withdrawable</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </React.Fragment>
  );
};

export default Dashboard;
