import React, { useState } from 'react';
import { Search, Play, Pause, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

const Options: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Scalper Terminal');
  const [selectedStrike, setSelectedStrike] = useState('24700');

  const optionsData = [
    { strike: '24400', callLtp: '335.85', callChange: '-43.48%', putLtp: '7.50', putChange: '+138.09%' },
    { strike: '24450', callLtp: '285.90', callChange: '-52.10%', putLtp: '12.25', putChange: '+89.45%' },
    { strike: '24500', callLtp: '235.95', callChange: '-61.20%', putLtp: '18.75', putChange: '+67.23%' },
    { strike: '24550', callLtp: '185.00', callChange: '-70.30%', putLtp: '28.50', putChange: '+45.67%' },
    { strike: '24600', callLtp: '134.05', callChange: '-79.40%', putLtp: '42.25', putChange: '+32.89%' },
    { strike: '24650', callLtp: '109.20', callChange: '-82.45%', putLtp: '50.00', putChange: '+28.76%' },
    { strike: '24700', callLtp: '84.00', callChange: '-72.25%', putLtp: '57.75', putChange: '+432.26%' },
    { strike: '24750', callLtp: '59.15', callChange: '-85.60%', putLtp: '68.50', putChange: '+156.78%' },
    { strike: '24800', callLtp: '34.30', callChange: '-88.75%', putLtp: '82.25', putChange: '+89.34%' },
    { strike: '24850', callLtp: '22.65', callChange: '-91.20%', putLtp: '98.00', putChange: '+67.45%' },
    { strike: '24900', callLtp: '16.80', callChange: '-93.10%', putLtp: '115.75', putChange: '+54.32%' },
    { strike: '25000', callLtp: '11.00', callChange: '-84.89%', putLtp: '282.95', putChange: '+247.82%' },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">Options</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="w-10 h-10">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="w-10 h-10">
            <Play className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="w-10 h-10">
            <Pause className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Scalper Terminal">Scalper Terminal</TabsTrigger>
          <TabsTrigger value="Option chain">Option chain</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-300px)]">
        {/* Chart Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Strike CE {selectedStrike}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">5m</Button>
              <Button variant="outline" size="sm">Indicators</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
              Chart will be rendered here
            </div>
          </CardContent>
        </Card>

        {/* Options Chain Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Strike PE {selectedStrike}</CardTitle>
            <div className="flex items-center gap-2">
              <select className="bg-background border border-input rounded px-2 py-1 text-sm">
                <option>NIFTY NSE</option>
              </select>
              <select className="bg-background border border-input rounded px-2 py-1 text-sm">
                <option>28 Aug 25 +1D</option>
              </select>
              <Button variant="outline" size="sm">Price</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">CALLS</TableHead>
                    <TableHead className="text-center">Strike (PCR)</TableHead>
                    <TableHead className="text-center">PUTS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optionsData.map((option, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="text-center">
                        <div className="text-sm font-medium">{option.callLtp}</div>
                        <Badge variant="destructive" className="text-xs">
                          {option.callChange}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">{option.strike}</TableCell>
                      <TableCell className="text-center">
                        <div className="text-sm font-medium">{option.putLtp}</div>
                        <Badge variant="default" className="text-xs">
                          {option.putChange}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Panel */}
      <div className="fixed bottom-0 left-72 right-0 bg-card border-t border-border p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CALL Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span>CALL</span>
              <span>L 74.5 H 24689.6</span>
            </div>
            <div className="flex gap-2">
              <Input type="text" placeholder="1 Lot" className="flex-1" />
              <Button className="bg-success hover:bg-success/90">Buy</Button>
              <Button variant="outline">SL</Button>
              <Button variant="outline">Qty</Button>
              <Button variant="destructive">Sell</Button>
              <Button variant="outline">SL</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Exit NIFTY</Button>
              <Button variant="outline">Cancel NIFTY</Button>
            </div>
          </div>

          {/* PUT Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span>PUT</span>
              <span>L 10.3 H 64.05</span>
            </div>
            <div className="flex gap-2">
              <Input type="text" placeholder="1 Lot" className="flex-1" />
              <Button className="bg-success hover:bg-success/90">Buy</Button>
              <Button variant="outline">SL</Button>
              <Button variant="outline">Qty</Button>
              <Button variant="destructive">Sell</Button>
              <Button variant="outline">SL</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Exit NIFTY</Button>
              <Button variant="outline">Cancel NIFTY</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
