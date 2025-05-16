import { Room } from "@/lib/models";
import { StatCard } from "./StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BedDouble, Users, Ban, DollarSign, Home } from "lucide-react";

interface StatsPanelProps {
  rooms: Room[];
  stats: {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
    maintenanceRooms: number;
    totalCapacity: number;
    totalValue: number;
    averagePrice: number;
  };
  roomTypes: string[];
}

export const StatsPanel = ({ rooms, stats, roomTypes }: StatsPanelProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard 
        title="Total Habitaciones" 
        value={stats.totalRooms}
        description="Habitaciones en el hotel"
        icon={<BedDouble className="h-4 w-4 text-muted-foreground" />}
      />
      
      <StatCard 
        title="Habitaciones Disponibles" 
        value={stats.availableRooms}
        description="Listas para ocupar"
        icon={<Home className="h-4 w-4 text-green-500" />}
      />
      
      <StatCard 
        title="Habitaciones Ocupadas" 
        value={stats.occupiedRooms}
        description="Actualmente con huéspedes"
        icon={<Users className="h-4 w-4 text-blue-500" />}
      />
      
      <StatCard 
        title="En Mantenimiento" 
        value={stats.maintenanceRooms}
        description="No disponibles temporalmente"
        icon={<Ban className="h-4 w-4 text-amber-500" />}
      />
      
      <StatCard 
        title="Capacidad Total" 
        value={stats.totalCapacity}
        description="Personas que pueden hospedarse"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      
      <StatCard 
        title="Precio Promedio" 
        value={`$${stats.averagePrice.toFixed(2)}`}
        description="Valor promedio por habitación"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      
      <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Distribución por Tipo</CardTitle>
          <CardDescription>
            Tipos de habitaciones en el hotel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roomTypes.map(type => {
              const count = rooms.filter(room => room.type === type).length;
              const percentage = (count / rooms.length) * 100;
              
              return (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{type}</span>
                    <span className="text-muted-foreground">{count} habitaciones ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary rounded-full h-2" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 sm:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>Distribución por Estado</CardTitle>
          <CardDescription>
            Estado actual de las habitaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Disponibles</span>
                <span className="text-sm text-green-500 font-medium">{stats.availableRooms}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-green-500 rounded-full h-3" 
                  style={{ width: `${(stats.availableRooms / stats.totalRooms) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Ocupadas</span>
                <span className="text-sm text-red-500 font-medium">{stats.occupiedRooms}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-red-500 rounded-full h-3" 
                  style={{ width: `${(stats.occupiedRooms / stats.totalRooms) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Mantenimiento</span>
                <span className="text-sm text-amber-500 font-medium">{stats.maintenanceRooms}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-amber-500 rounded-full h-3" 
                  style={{ width: `${(stats.maintenanceRooms / stats.totalRooms) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 