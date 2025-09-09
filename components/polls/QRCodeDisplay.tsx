'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Download, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

type QRCodeDisplayProps = {
  pollId: string;
  pollTitle: string;
};

export default function QRCodeDisplay({ pollId, pollTitle }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [pollUrl, setPollUrl] = useState<string>('');

  useEffect(() => {
    // Set the poll URL after component mounts to avoid SSR issues
    setPollUrl(`${window.location.origin}/polls/${pollId}`);
  }, [pollId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      toast.success('Poll link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('poll-qr-code')?.querySelector('canvas');
    if (!canvas) {
      toast.error('Could not generate QR code image');
      return;
    }

    try {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${pollTitle.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded!');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  if (!pollUrl) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Poll
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Poll
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div id="poll-qr-code" className="bg-white p-4 rounded-lg border">
            <QRCodeSVG value={pollUrl} size={200} level="H" />
          </div>
          
          <div className="mt-4 w-full space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Share this QR code or link with others to let them vote on your poll
            </p>
            
            <div className="flex gap-2 justify-center">
              <Button onClick={handleDownloadQR} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
              
              <Button onClick={handleCopyLink} variant="outline" size="sm">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}