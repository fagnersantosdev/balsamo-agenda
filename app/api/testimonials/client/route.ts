import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const author = formData.get("author")?.toString() || "Anônimo";
    const message = formData.get("message")?.toString() || "";
    const rating = Number(formData.get("rating") || 5);
    const photo = formData.get("photo") as File | null;

    if (!message.trim()) {
      return NextResponse.json(
        { error: "Mensagem obrigatória" },
        { status: 400 }
      );
    }

    let photoUrl: string | null = null;

    // 📌 Se o cliente fizer upload da imagem
    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public/uploads/testimonials");
      const filename = `${Date.now()}-${photo.name.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);
      photoUrl = `/uploads/testimonials/${filename}`;
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        author,
        message,
        rating,
        photoUrl,
        approved: false, // ⭐ começa como pendente
      },
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    return NextResponse.json(
      { error: "Erro ao enviar avaliação" },
      { status: 500 }
    );
  }
}