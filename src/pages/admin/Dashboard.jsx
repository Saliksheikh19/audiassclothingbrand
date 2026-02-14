import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Truck, ShoppingBag, ShoppingCart, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { stats, orders } = useAdmin();

    const chartData = [
        { name: '10am', today: 4000, yesterday: 2400 },
        { name: '12pm', today: 3000, yesterday: 1398 },
        { name: '2pm', today: 2000, yesterday: 9800 },
        { name: '4pm', today: 2780, yesterday: 3908 },
        { name: '6pm', today: 1890, yesterday: 4800 },
        { name: '8pm', today: 2390, yesterday: 3800 },
        { name: '10pm', today: 3490, yesterday: 4300 },
    ];

    return (
        <div className="space-y-8">
            {/* Top Stats Section */}
            <div className="flex flex-col xl:flex-row gap-6 items-start">
                <div className="bg-[#1E293B] p-6 rounded-2xl w-full xl:w-auto xl:min-w-[300px] flex-shrink-0">
                    <h2 className="text-gray-400 text-sm font-medium mb-1">Total Revenue</h2>
                    <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-white">Rs {stats.totalRevenue.toLocaleString()}.00</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-red-500 font-medium">▼ Rs 1,294</span>
                        <span className="text-green-500 font-medium">▲ Rs 1,294</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full">
                    {/* Delivered Orders Card - Blue */}
                    <div className="bg-[#4285F4] p-6 rounded-2xl text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-semibold text-lg">Delivered orders</h3>
                            <div className="flex items-center justify-between mt-4">
                                <Truck size={32} className="opacity-80" />
                                <span className="text-5xl font-bold">{stats.deliveredOrders}</span>
                            </div>
                        </div>
                        <Truck size={100} className="absolute -bottom-4 -left-4 opacity-10 rotate-12" />
                    </div>

                    {/* Pending Orders Card - Pink */}
                    <div className="bg-[#EA4335] p-6 rounded-2xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-semibold text-lg">Pending orders</h3>
                            <div className="flex items-center justify-between mt-4">
                                <ShoppingCart size={32} className="opacity-80" />
                                <span className="text-5xl font-bold">{stats.pendingOrders}</span>
                            </div>
                        </div>
                        <ShoppingCart size={100} className="absolute -bottom-4 -left-4 opacity-10 rotate-12" />
                    </div>

                    {/* New Orders Card - Purple */}
                    <div className="bg-[#A142F4] p-6 rounded-2xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-semibold text-lg">New orders</h3>
                            <div className="flex items-center justify-between mt-4">
                                <ShoppingBag size={32} className="opacity-80" />
                                <span className="text-5xl font-bold">{stats.totalOrders}</span>
                            </div>
                        </div>
                        <ShoppingBag size={100} className="absolute -bottom-4 -left-4 opacity-10 rotate-12" />
                    </div>
                </div>
            </div>

            {/* Middle Section: Inbox and Recent Activity vs Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Inbox & Activity) */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Inbox */}
                    <div className="bg-[#1E293B] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-white font-bold text-lg">Inbox</h3>
                                <p className="text-gray-400 text-xs">Group: Support</p>
                            </div>
                            <button className="text-blue-500 text-xs font-semibold hover:underline">View details</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                                <span className="text-gray-300 text-sm">Waiting for order#12345</span>
                                <span className="text-gray-500 text-xs">4:39</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-sm">Customer support id#22234</span>
                                <span className="text-gray-500 text-xs">11:07</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-[#1E293B] rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-bold text-lg">Recent Activity</h3>
                            <button className="text-blue-500 text-xs font-semibold hover:underline">View all</button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { text: 'Confirm order update', type: 'urgent', color: 'bg-yellow-500' },
                                { text: 'Finish shipping update', type: 'urgent', color: 'bg-red-500' },
                                { text: 'Create new order', type: 'new', color: 'bg-green-500' },
                                { text: 'Update payment report', type: 'default', color: 'bg-blue-500' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between pb-3 last:pb-0 border-b border-gray-700 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.color.replace('bg-', 'bg-')}`}></div> {/* Or check icon */}
                                        <CheckCircle size={16} className="text-blue-500" />
                                        <span className="text-gray-300 text-sm">{item.text}</span>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md text-black uppercase ${item.type === 'urgent' ? 'bg-yellow-400' :
                                        item.type === 'new' ? 'bg-green-400' : 'bg-gray-300'
                                        }`}>
                                        {item.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Chart) */}
                <div className="lg:col-span-2 bg-[#1E293B] rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-white font-bold text-xl">Today's Sales</h3>
                            <p className="text-gray-400 text-xs">30 Sept 2021</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-300">Today</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 bg-pink-500 rounded-full"></div>
                                <span className="text-gray-300">Yesterday</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94A3B8" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="today"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="yesterday"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
