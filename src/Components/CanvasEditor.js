
import React, { useRef, useEffect, useState } from 'react';
import CanvasManager from './CanvasManager';
import 'tailwindcss/tailwind.css';

const CanvasEditor = () => {
  const canvasRef = useRef(null);
  const [canvasManager, setCanvasManager] = useState(null);
  const [caption, setCaption] = useState("");
  const [cta, setCta] = useState("");
  const [backgroundColor, setBackgroundColor] = useState('#0369A1');

  const templateData = {
    caption: {
      text: caption,
      position: { x: 50, y: 50 },
      max_characters_per_line: 31,
      font_size: 44,
      alignment: 'left',
      text_color: '#000000'
    },
    cta: {
      text: cta,
      position: { x: 190, y: 320 },
      font_size: 30,
      text_color: '#FFFFFF',
      background_color: '#000000'
    },
    image_mask: {
      x: 56,
      y: 442,
      width: 970,
      height: 600
    },
    urls: {
      mask: 'https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_mask.png',
      stroke: 'https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Mask_stroke.png',
      design_pattern: 'https://d273i1jagfl543.cloudfront.net/templates/global_temp_landscape_temp_10_Design_Pattern.png'
    },
    backgroundColor: backgroundColor
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const manager = new CanvasManager(canvas, templateData);
    setCanvasManager(manager);
    manager.render();
  }, []);

  useEffect(() => {
    if (canvasManager) {
      console.log("asd",backgroundColor)
      canvasManager.setText('caption', caption);
      canvasManager.setText('cta', cta);
      canvasManager.setBackgroundColor(backgroundColor);
    }
  }, [caption, cta, backgroundColor, canvasManager]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          if (canvasManager) {
            canvasManager.setImage(img);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start p-4">
      <div className="w-full lg:w-1/2 flex justify-center">
        <canvas ref={canvasRef} width="1080" height="1080" style={{ height: 500, width: 500 }} className="border border-gray-400" />
      </div>
      <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:ml-4">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">Caption:</label>
          <input 
            type="text" 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">CTA:</label>
          <input 
            type="text" 
            value={cta} 
            onChange={(e) => setCta(e.target.value)} 
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">Background Color:</label>
          <input 
            type="color" 
            value={backgroundColor} 
            onChange={(e) => setBackgroundColor(e.target.value)} 
            className="border rounded p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700">Upload Image:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="border rounded p-2 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;

