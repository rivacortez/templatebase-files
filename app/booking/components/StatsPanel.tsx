import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, CalendarX, FileCheck, Wallet } from "lucide-react";

interface StatItemProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatItem = ({ title, value, description, icon, trend }: StatItemProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium">{title}</h3>
          <div className="p-2 bg-primary/10 rounded-full text-primary">{icon}</div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`mt-2 text-xs ${trend.isPositive ? "text-green-500" : "text-destructive"}`}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% desde el mes anterior
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface StatsPanelProps {
  bookings: any[]; // Utilizamos any por los datos relacionados
}

export const StatsPanel = ({ bookings }: StatsPanelProps) => {
  const confirmedBookings = bookings.filter(b => b.state === "confirmada").length;
  const cancelledBookings = bookings.filter(b => b.state === "cancelada").length;
  const totalRevenue = bookings
    .filter(b => b.state === "confirmada")
    .reduce((sum, b) => sum + b.total_price, 0);
  const pendingBookings = bookings.filter(b => b.state === "pendiente").length;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatItem
        title="Reservas Confirmadas"
        value={confirmedBookings.toString()}
        description="Total de reservas confirmadas"
        icon={<CalendarCheck className="h-4 w-4" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatItem
        title="Reservas Canceladas"
        value={cancelledBookings.toString()}
        description="Total de reservas canceladas"
        icon={<CalendarX className="h-4 w-4" />}
        trend={{ value: 5, isPositive: false }}
      />
      <StatItem
        title="Ingresos Totales"
        value={totalRevenue.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2
        })}
        description="Ingresos por reservas confirmadas"
        icon={<Wallet className="h-4 w-4" />}
        trend={{ value: 8, isPositive: true }}
      />
      <StatItem
        title="Reservas Pendientes"
        value={pendingBookings.toString()}
        description="Reservas en espera de confirmación"
        icon={<FileCheck className="h-4 w-4" />}
      />
    </div>
  );
}; 