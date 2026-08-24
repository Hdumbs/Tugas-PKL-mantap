import React, { useRef, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Camera, Zap, RefreshCw, AlertCircle, Upload, XCircle, Grid, Sparkles, Image as ImageIcon, ShieldCheck } from 'lucide-react';

export default function Scanner({ errors }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [showGrid, setShowGrid] = useState(false);

    const scanErrorMessage = errors?.scan_error;

    const startCamera = async () => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            console.error('Camera access failed:', err);
            setCameraError('Kamera tidak aktif. Anda dapat mengunggah gambar makanan.');
            setCameraActive(false);
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        if (isProcessing) return;
        setIsProcessing(true);

        if (cameraActive && videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

            router.post('/scan/process', { image: dataUrl }, {
                onFinish: () => setIsProcessing(false)
            });
        } else {
            router.post('/scan/process', {}, {
                onFinish: () => setIsProcessing(false)
            });
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsProcessing(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            router.post('/scan/process', { image: reader.result }, {
                onFinish: () => setIsProcessing(false)
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-[#f7faf4] text-[#223311] font-sans flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-2xs">
                <div className="flex items-center gap-3">
                    <img src="/images/logo.png" alt="CHIA Logo" className="w-10 h-10 object-contain" />
                <div>
                    <h1 className="text-base font-extrabold text-[#223311]">Amidyas Food Scanner</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nutritional AI Engine</p>
                </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center gap-2 ${
                            showGrid
                                ? 'bg-[#eef6e6] border-[#64ac1d] text-[#64ac1d]'
                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Grid size={16} /> Grid
                    </button>
                    <a
                        href="/admin/dashboard"
                        className="px-4 py-2 bg-[#64ac1d] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
                    >
                        Portal Admin
                    </a>
                </div>
            </header>

            {/* Desktop Layout Container */}
            <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 gap-4">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#64ac1d] bg-[#eef6e6] px-3 py-1 rounded-full mb-2 inline-block">
                                AI FOOD SCANNER
                            </span>
                            <h2 className="text-2xl font-extrabold text-[#223311]">Pindai Makanan Kamu</h2>
                            <p className="text-xs text-gray-400 font-medium mt-1">
                                Arahkan kamera ke piring makanan atau unggah foto untuk menghitung kalori & nutrisi otomatis.
                            </p>
                        </div>
                    </div>

                    {/* Non-Food Error Alert */}
                    {scanErrorMessage && (
                        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-extrabold flex items-center gap-3">
                            <XCircle size={20} className="shrink-0 text-rose-600" />
                            <span>{scanErrorMessage}</span>
                        </div>
                    )}

                    {/* Desktop Split View (Camera Viewport + Control Panel) */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        
                        {/* Camera Viewport (Left) */}
                        <div className="md:col-span-8 bg-slate-950 rounded-3xl overflow-hidden relative shadow-inner min-h-[420px] flex items-center justify-center border border-gray-200">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={`w-full h-[420px] object-cover transition-opacity duration-500 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {!cameraActive && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center filter brightness-50"
                                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80')` }}
                                />
                            )}

                            {showGrid && (
                                <div className="absolute inset-0 pointer-events-none opacity-20 grid grid-cols-3 grid-rows-3 z-10">
                                    <div className="border-r border-b border-white" />
                                    <div className="border-r border-b border-white" />
                                    <div className="border-b border-white" />
                                    <div className="border-r border-b border-white" />
                                    <div className="border-r border-b border-white" />
                                    <div className="border-b border-white" />
                                    <div className="border-r border-white" />
                                    <div className="border-r border-white" />
                                    <div />
                                </div>
                            )}

                            {/* Clean Framing Box */}
                            <div className="absolute z-20 w-64 md:w-80 h-64 md:h-80 border-2 border-[#64ac1d] rounded-2xl flex items-center justify-center p-4">
                                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-extrabold text-emerald-300 border border-[#64ac1d]/50">
                                    Posisikan Makanan Di Sini
                                </div>
                            </div>

                            {cameraError && (
                                <div className="absolute bottom-4 left-4 right-4 z-20 bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs p-3 rounded-xl backdrop-blur-md flex items-center gap-2">
                                    <AlertCircle size={16} className="shrink-0 text-amber-400" />
                                    <span>{cameraError}</span>
                                </div>
                            )}
                        </div>

                        {/* Controls Panel (Right) */}
                        <div className="md:col-span-4 space-y-6 flex flex-col justify-center">
                            
                            {/* Main Capture Button */}
                            <div className="bg-[#f7faf4] p-6 rounded-3xl border border-gray-100 text-center space-y-4">
                                <button
                                    onClick={handleCapture}
                                    disabled={isProcessing}
                                    className="w-full py-4 bg-[#64ac1d] hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm rounded-2xl shadow-md transition flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? (
                                        <>
                                            <RefreshCw className="animate-spin" size={20} />
                                            <span>Menganalisis...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Camera size={22} />
                                            <span>Ambil Foto Makanan</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-[11px] text-gray-400 font-semibold">
                                    Gemini AI mendeteksi kalori & makronutrisi secara instan.
                                </p>
                            </div>

                            {/* Upload Option */}
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-3">
                                <h3 className="font-extrabold text-xs text-gray-500 uppercase tracking-wider">Atau Unggah Dari File</h3>
                                <label className="w-full py-3.5 px-4 bg-gray-50 hover:bg-gray-100 text-[#223311] font-extrabold text-xs rounded-2xl border border-gray-200 transition cursor-pointer flex items-center justify-center gap-2">
                                    <ImageIcon size={18} className="text-[#64ac1d]" />
                                    <span>Pilih Gambar Makanan</span>
                                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                                </label>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
