import { CertificateTemplate, IssuedCertificate } from '../types';

/**
 * Generates a clean high-resolution canvas render of the certificate
 * and triggers a PNG download for the user.
 */
export async function downloadCertificateAsPng(
  certificate: IssuedCertificate,
  elementId: string = 'certificate-preview-card'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Elemento do certificado não encontrado para download.');
  }

  // We can create a high-DPI canvas capture using standard HTML5 Canvas
  const rect = element.getBoundingClientRect();
  const scale = 2; // High-res 2x
  const canvas = document.createElement('canvas');
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // Render SVG foreignObject to draw DOM element with full typography and styles
  const cloned = element.cloneNode(true) as HTMLElement;
  cloned.style.transform = 'none';
  cloned.style.boxShadow = 'none';

  const data = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width}" height="${rect.height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${new XMLSerializer().serializeToString(cloned)}
        </div>
      </foreignObject>
    </svg>
  `;

  const img = new Image();
  const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const link = document.createElement('a');
      link.download = `Certificado-${certificate.studentName.replace(/\s+/g, '_')}-${certificate.verificationCode}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      resolve();
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      // Fallback: standard window print dialog
      window.print();
      resolve();
    };
    img.src = url;
  });
}

/**
 * Generate a cryptographically sound and realistic verification code
 */
export function generateVerificationCode(prefix: string = 'SGI-SGSO'): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${year}-${randomPart}`;
}
