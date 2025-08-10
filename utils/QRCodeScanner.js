import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

const QRCodeScanner = ({ onDetected, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 初始化摄像头
  const startScanner = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // 使用后置摄像头
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true); // iOS 支持
        videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err) {
      setError('无法访问摄像头，请确保已授予权限');
      console.error('摄像头访问错误:', err);
    }
  };

  // 停止扫描并释放资源
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  // 处理二维码识别
  const tick = () => {
    if (!isScanning || !videoRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 设置 canvas 尺寸与视频一致
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    // 如果识别到二维码
    if (code) {
      stopScanner();
      onDetected(code.data);
    }

    // 继续下一帧扫描
    requestAnimationFrame(tick);
  };

  // 启动扫描循环
  useEffect(() => {
    if (isScanning) {
      tick();
    }

    // 组件卸载时停止扫描
    return () => stopScanner();
  }, [isScanning]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md aspect-square bg-white rounded-lg overflow-hidden">
        {/* 视频预览 */}
        <video ref={videoRef} className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
        
        {/* 扫描框指示器 */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-green-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-scan"></div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-6 flex gap-4">
        {!isScanning ? (
          <button
            onClick={startScanner}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            开始扫描
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
          >
            停止扫描
          </button>
        )}
        
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
        >
          关闭
        </button>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default QRCodeScanner;
