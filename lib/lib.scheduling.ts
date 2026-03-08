import { prisma } from "@/lib/prisma";

/**
 * Retorna a duração total de um atendimento:
 * serviço + buffer global configurado pela admin
 */
export async function getTotalDuration(serviceId: number) {
  // 🔧 Serviço
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      durationMin: true,
      active: true,
    },
  });

  if (!service || !service.active) {
    throw new Error("Serviço inválido ou inativo");
  }

  // ⚙️ Configuração global (buffer)
  const settings = await prisma.settings.findUnique({
    where: { id: 1 }, // singleton
    select: {
      bufferMinutes: true,
    },
  });

  const buffer = settings?.bufferMinutes ?? 0;

  return {
    serviceDuration: service.durationMin,
    bufferMinutes: buffer,
    total: service.durationMin + buffer,
  };
}