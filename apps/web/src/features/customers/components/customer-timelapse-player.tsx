"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  RotateCcw,
  Play,
  Pause,
  Smartphone,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { CustomerTimelineEventDTO } from "@fluxos/contracts";
import { formatDate, formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/features/orders/components/order-status-badge";
import { Button, Card, CardContent, Badge } from "@/components/ui";

const ICON_MAP = {
  smartphone: Smartphone,
  wrench: Wrench,
  clock: Clock,
  check: CheckCircle2,
  alert: AlertCircle,
};

interface CustomerTimelapsePlayerProps {
  timelineEvents: CustomerTimelineEventDTO[];
}

export function CustomerTimelapsePlayer({ timelineEvents }: CustomerTimelapsePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [playbackSpeed] = useState(1800);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveStep((prev) => {
          if (prev >= timelineEvents.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, timelineEvents.length]);

  useEffect(() => {
    if (eventRefs.current[activeStep]) {
      eventRefs.current[activeStep]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeStep]);

  if (timelineEvents.length === 0) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-12 text-center text-muted-foreground text-sm">
          Nenhum evento registrado ainda para este cliente. Abra uma nova OS para iniciar o histórico.
        </CardContent>
      </Card>
    );
  }

  const currentActiveEvent = timelineEvents[activeStep];
  const progressPercent = Math.round(((activeStep + 1) / timelineEvents.length) * 100);

  return (
    <div className="space-y-6">
      {/* Player Controls Card */}
      <Card className="shadow-sm border-primary/20 bg-gradient-to-r from-blue-50/60 via-indigo-50/30 to-purple-50/40">
        <CardContent className="p-4 md:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold tracking-wider">
                  Modo Timelapse
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Evento {activeStep + 1} de {timelineEvents.length}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">
                {currentActiveEvent?.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatDate(currentActiveEvent?.date)}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs bg-white shadow-none gap-1"
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStep(0);
                }}
                title="Reiniciar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Início</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs bg-white shadow-none"
                disabled={activeStep === 0}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStep((prev) => Math.max(0, prev - 1));
                }}
              >
                Anterior
              </Button>

              <Button
                size="sm"
                className={`h-8 px-4 text-xs font-semibold shadow-none gap-1.5 ${
                  isPlaying ? "bg-amber-600 hover:bg-amber-700" : "bg-primary"
                }`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Reproduzir Timelapse</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs bg-white shadow-none"
                disabled={activeStep >= timelineEvents.length - 1}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveStep((prev) => Math.min(timelineEvents.length - 1, prev + 1));
                }}
              >
                Próximo
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
              <span>Primeiro Atendimento</span>
              <span>Momento Mais Recente</span>
            </div>
            <div
              className="w-full h-2 rounded-full bg-border overflow-hidden cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percent = clickX / rect.width;
                const targetIdx = Math.min(
                  timelineEvents.length - 1,
                  Math.max(0, Math.floor(percent * timelineEvents.length))
                );
                setIsPlaying(false);
                setActiveStep(targetIdx);
              }}
            >
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Timeline Nodes */}
      <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
        {timelineEvents.map((evt, idx) => {
          const Icon = ICON_MAP[evt.iconType] || Clock;
          const isActive = idx === activeStep;

          return (
            <div
              key={evt.id}
              ref={(el) => {
                eventRefs.current[idx] = el;
              }}
              onClick={() => {
                setIsPlaying(false);
                setActiveStep(idx);
              }}
              className={`relative transition-all duration-300 cursor-pointer ${
                isActive ? "scale-[1.01]" : "opacity-90 hover:opacity-100"
              }`}
            >
              <div
                className={`absolute -left-6 md:-left-8 top-3.5 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center -translate-x-1/2 transition-all duration-300 border-2 ${
                  isActive
                    ? "bg-primary text-white border-primary ring-4 ring-primary/20 scale-110 shadow-md"
                    : "bg-background text-muted-foreground border-border"
                }`}
              >
                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>

              <Card
                className={`shadow-none transition-all duration-300 border ${
                  isActive
                    ? "border-primary ring-1 ring-primary/30 bg-primary/[0.02] shadow-sm"
                    : "hover:border-border/80 hover:bg-muted/30"
                }`}
              >
                <CardContent className="p-4 md:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm md:text-base">
                          {evt.title}
                        </span>
                        {isActive && (
                          <Badge className="bg-primary text-white text-[10px] py-0 px-1.5">
                            Momento Ativo
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {evt.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {formatDate(evt.date)}
                      </span>
                      {evt.status && (
                        <StatusBadge status={evt.status as any} />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {evt.description && (
                      <div className="md:col-span-2 text-muted-foreground bg-muted/40 p-2.5 rounded-md">
                        <span className="font-medium text-foreground block mb-0.5">Observação:</span>
                        {evt.description}
                      </div>
                    )}

                    {evt.total && evt.total > 0 ? (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-md text-emerald-900 flex flex-col justify-center">
                        <span className="text-[11px] font-medium text-emerald-700">Valor</span>
                        <span className="text-sm font-bold">{formatCurrency(evt.total)}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                    <span className="text-muted-foreground">
                      Registrado por: <strong className="text-foreground font-medium">{evt.author}</strong>
                    </span>

                    <Button variant="ghost" size="sm" asChild className="h-7 text-xs text-primary gap-1">
                      <Link href={`/orders/${evt.orderId}`}>
                        <span>Ver OS #{evt.orderNumber}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
