'use client';
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import DrawerModal from '@/components/DrawerModal';
import { Button } from "@heroui/react";
import jsQR from 'jsqr';

const WALLET_ADDRESS = "0x3cB098812e55f96C8Db7D50104FFde5a76F677FB";
const PRODUCT_LIST = [
  { img: '/images/product1.png', name: 'Smart Pods', num: '100' },
  { img: '/images/product2.png', name: 'Gen2 Vapes', num: '100' }
];

const formatWalletAddress = (address: string) =>
  !address || address.length < 10
    ? address
    : `${address.slice(0, 6)}...${address.slice(-4)}`;

export default function HomePage() {
  const drawerRef = useRef<{ handleOpen: () => void }>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleOpen = useCallback(() => {
    drawerRef.current?.handleOpen();
  }, []);
  // 扫码功能
  useEffect(() => {
    if (!showScanner) return;

    let animationId: number;
    let stream: MediaStream | null = null;
    let stopped = false;

    const stopStream = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
    };

    const scan = async () => {
      if (!videoRef.current || !canvasRef.current) {
        animationId = requestAnimationFrame(scan);
        return;
      }
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animationId = requestAnimationFrame(scan);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setScanResult(code.data);
        setScanning(false);
        setShowScanner(false);
        stopStream();
        stopped = true;
        return;
      }
      animationId = requestAnimationFrame(scan);
    };

    const startScan = async () => {
      setScanResult(null);
      setScanning(true);
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        animationId = requestAnimationFrame(scan);
      } catch (err) {
        setScanResult('Camera access denied or not available');
        setScanning(false);
      }
    };

    startScan();

    return () => {
      setScanning(false);
      if (animationId) cancelAnimationFrame(animationId);
      stopStream();
      stopped = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showScanner]);

  return (
    <>
      <header className="text-center space-y-8 mb-9">
        <div className="space-y-4 pt-14">
          <h1 className="relative text-lg font-bold text-white">
            Convertible Items
            <img src="/images/close.svg" alt="Close" className="inline-block w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2" />
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
          <span className="text-[.8rem]">
            {formatWalletAddress(WALLET_ADDRESS)}{' '}
            <img src="/images/history.svg" alt="History" className="inline-block w-5 h-5" />
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[#5F5F5F] text-[.8rem]">Order Number</span>
          <span className="text-[.8rem]">202504211136</span>
        </div>
      </section>
      <section>
        {PRODUCT_LIST.map((item, idx) => (
          <div className="flex items-center justify-between mx-6 mt-6" key={item.name}>
            <div className="flex items-center justify-center">
              <img src={item.img} alt={item.name} className="inline-block w-15" />
              <div className="ml-3">
                <p className="text-[#F3F2F2] text-[1rem]">{item.name}</p>
                <p className="flex items-center gap-1 text-[.8rem]">
                  <img src="/images/box.svg" alt="box" className="inline-block w-3 h-3" />
                  <span className="text-[#747474]">Inventory:</span> {item.num}
                </p>
              </div>
            </div>
            <Button
              radius="full"
              className="bg-[#FF4C33] text-white h-[2.2rem]"
              onPress={handleOpen}
            >
              Redeem
            </Button>
          </div>
        ))}
      </section>
      <div className="text-center mt-10">
        <Button color="primary" radius="full" onPress={() => setShowScanner(true)}>
          Scan
        </Button>
      </div>
      {/* 扫码弹窗 */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-[#181818] rounded-lg p-6 relative w-[90vw] max-w-[400px] flex flex-col items-center">
            <button
              className="absolute right-3 top-3 text-white text-xl"
              onClick={() => setShowScanner(false)}
              aria-label="Close"
            >
              ×
            </button>
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              style={{ maxHeight: 300, background: '#000' }}
              playsInline
              muted
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="mt-4 text-white text-center">
              {scanning && 'Scanning...'}
              {scanResult && <div>Result: {scanResult}</div>}
            </div>
          </div>
        </div>
      )}
      <DrawerModal ref={drawerRef} />
    </>
  );
}
