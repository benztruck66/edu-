import type { Metadata } from "next";

export const universitiesMetadata: Metadata = {
  title: "Их сургуулиуд - Edu Portal",
  description: "Монголын их, дээд сургуулиудын мэдээлэл, зэрэглэл, хөтөлбөрүүд",
  openGraph: {
    title: "Их сургуулиуд - Edu Portal",
    description: "Монголын их, дээд сургуулиудын мэдээлэл, зэрэглэл, хөтөлбөрүүд",
    type: "website",
  },
};

export function generateUniversityMetadata(name: string): Metadata {
  return {
    title: `${name} - Edu Portal`,
    description: `${name} их сургуулийн дэлгэрэнгүй мэдээлэл, хөтөлбөрүүд, тэтгэлэг, төлбөрийн мэдээлэл`,
    openGraph: {
      title: `${name} - Edu Portal`,
      description: `${name} их сургуулийн дэлгэрэнгүй мэдээлэл`,
      type: "website",
    },
  };
}










