'use client';

import { useLightbox } from '../../contexts/LightboxContext';
import { DocIcon } from '../layout/Section';

type CertLinkButtonProps = {
  url: string;
  title: string;
  label: string;
};

export default function CertLinkButton({ url, title, label }: CertLinkButtonProps) {
  const { openLightbox } = useLightbox();
  return (
    <button type="button" className="cert-badge-link" onClick={() => openLightbox(url, title)}>
      <DocIcon />
      {label}
    </button>
  );
}
