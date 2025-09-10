'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Download, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  pollId: string;
  pollTitle: string;
}

export default function QRCodeDisplay({ pollId, pollTitle }: QRCodeDisplayProps) {
  const [pollUrl, setPollUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate getting the poll URL
    setTimeout(() => {
      setPollUrl(`${window.location.origin}/polls/${pollId}`);
      setIsLoading(false);
    }, 500);
  }, [pollId]);

  const handleDownload = () => {
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `poll-${pollId}-qr.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code');
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Share Poll
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white rounded-lg border">
                <QRCodeSVG
                  value={pollUrl}
                  size={128}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Scan this QR code to quickly access the poll
              </p>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={handleDownload}
                variant="outline" 
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}