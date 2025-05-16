import { Booking } from "@/lib/models";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/datepicker";

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  booking: Partial<Booking>;
  setBooking: (booking: Partial<Booking>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export const BookingFormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  booking,
  setBooking,
  onSubmit,
  isSubmitting,
  submitLabel,
}: BookingFormDialogProps) => {
  const handleChange = (field: keyof Booking, value: string | number) => {
    setBooking({ ...booking, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_id">ID Cliente <span className="text-destructive">*</span></Label>
              <Input
                id="customer_id"
                type="number"
                value={booking.customer_id || ""}
                onChange={e => handleChange("customer_id", Number(e.target.value))}
                placeholder="ID del cliente"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room_id">ID Habitación <span className="text-destructive">*</span></Label>
              <Input
                id="room_id"
                type="number"
                value={booking.room_id || ""}
                onChange={e => handleChange("room_id", Number(e.target.value))}
                placeholder="ID de la habitación"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Fecha inicio <span className="text-destructive">*</span></Label>
              <Input
                id="start_date"
                type="date"
                value={booking.start_date || ""}
                onChange={e => handleChange("start_date", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">Fecha fin <span className="text-destructive">*</span></Label>
              <Input
                id="end_date"
                type="date"
                value={booking.end_date || ""}
                onChange={e => handleChange("end_date", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_price">Total <span className="text-destructive">*</span></Label>
              <Input
                id="total_price"
                type="number"
                value={booking.total_price || ""}
                onChange={e => handleChange("total_price", Number(e.target.value))}
                placeholder="Total de la reserva"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Select
                value={booking.state || "pendiente"}
                onValueChange={value => handleChange("state", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={
              isSubmitting ||
              !booking.customer_id ||
              !booking.room_id ||
              !booking.start_date ||
              !booking.end_date ||
              !booking.total_price
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};