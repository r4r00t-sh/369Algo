import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent } from '../components/ui/card';
import { MessageSquare, Clock } from 'lucide-react';

const Orders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Stocks and F&O');

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <Button>Go to Watchlist</Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Stocks and F&O">Stocks and F&O</TabsTrigger>
          <TabsTrigger value="Mutual funds">Mutual funds</TabsTrigger>
          <TabsTrigger value="IPO">IPO</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-[calc(100vh-300px)] text-center">
        <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <div className="relative">
            <MessageSquare className="w-16 h-16 text-primary" />
            <Clock className="w-8 h-8 text-primary absolute -bottom-2 -right-2" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">No open orders yet</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          There are no pending orders at the moment.
        </p>
        <Button>Go to Watchlist</Button>
      </div>
    </div>
  );
};

export default Orders;
