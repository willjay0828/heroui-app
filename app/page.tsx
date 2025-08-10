'use client';
import React, { useRef, useState } from 'react';
import DrawerModal from '@/components/DrawerModal'
import { Button } from "@heroui/react";
import QRCodeScanner from '@/utils/QRCodeScanner';
export default function HomePage() {
  const WalletAddress = "0x3cB098812e55f96C8Db7D50104FFde5a76F677FB";
  // 保留前6位和后4位
  const formatWalletAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  const list = [
    { img: '/images/product1.png', name: 'Smart Pods', num: '100' },
    { img: '/images/product2.png', name: 'Gen2 Vapes', num: '100' }
  ]

  const drawerRef = useRef<{ handleOpen: () => void }>(null);

  const handleOpen = () => {
    drawerRef.current?.handleOpen();
  };

  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const handleScanDetected = (data: React.SetStateAction<string>) => {
    setScanResult(data);
    setShowScanner(false);
    // 处理扫描结果，例如跳转或解析数据
    console.log('扫描结果:', data);
  };
  return (
    <>
      <header className="text-center space-y-8 mb-9">
        <div className="space-y-4 pt-14">
          <h1 className="relative text-lg font-bold text-white">
              Convertible Items
            <img src="/images/close.svg" alt="Close" className="inline-block w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2"/>
          </h1>
        </div>
      </header>
      <section className="border-2 border-[#2d2d2d] mx-6 p-4 rounded-lg">
        <div>
          <span className="inline-block bg-[#262626] px-4 rounded-4xl text-[.8rem] h-[3rem] w-[calc(100%-3rem)] leading-[3rem]">Oolong Tea (0%)</span>
          <span className="inline-block bg-[#262626] text-center rounded-4xl h-[3rem] w-[3rem] leading-[3rem]">×8</span>
        </div>
        <div className="mt-2">
          <span className="inline-block bg-[#262626] px-4 rounded-4xl text-[.8rem] h-[3rem] w-[calc(100%-3rem)] leading-[3rem]">Electric Blue Razz (2%)</span>
          <span className="inline-block bg-[#262626] text-center rounded-4xl h-[3rem] w-[3rem] leading-[3rem]">×18</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[#5F5F5F] text-[.8rem]">Wallet Address</span>
          <span className="text-[.8rem]">{formatWalletAddress(WalletAddress)} <img src="/images/history.svg" alt="History" className="inline-block w-5 h-5"/></span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[#5F5F5F] text-[.8rem]">Order Number</span>
          <span className="text-[.8rem]">202504211136</span>
        </div>
      </section>
      <section>
        {list.map((item, idx) => (
          <div className="flex items-center justify-between mx-6 mt-6" key={idx}>
            <div className="flex items-center justify-center">
              <img src={item.img} alt="Close" className="inline-block w-15" />
              <div className="ml-3">
                <p className="text-[#F3F2F2] text-[1rem]">{item.name}</p>
                <p className="flex items-center gap-1 text-[.8rem]">
                  <img src="/images/box.svg" alt="box" className="inline-block w-3 h-3" /> 
                  <span className='text-[#747474]'>Inventory:</span> {item.num}
                </p>
              </div>
            </div>
            <Button radius="full" className="bg-[#FF4C33] text-white h-[2.2rem]" onPress={() => handleOpen()}>Redeem</Button>
          </div>
        ))}
      </section>
      <div className="text-center mt-10">
        <Button color="primary" radius="full" onPress={() => setShowScanner(true)}>Scan</Button>
        {scanResult && (
          <div className="mt-8 p-4 border border-gray-300 rounded-md max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">扫描结果:</h2>
            <p className="break-all">{scanResult}</p>
            <button
              onClick={() => setScanResult('')}
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              清除结果
            </button>
          </div>
        )}
        {showScanner && (
          <QRCodeScanner
            onDetected={handleScanDetected}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
      <DrawerModal ref={drawerRef}/>
    </>
  );
}
