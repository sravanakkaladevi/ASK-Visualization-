import { describe, expect, it } from 'vitest';
import { generateTcpHandshakeSteps } from './tcpHandshake';

describe('TCP 3-Way Handshake Animation', () => {
  it('should generate steps for SYN, SYN-ACK, ACK, and ESTABLISHED states', () => {
    const steps = generateTcpHandshakeSteps();
    expect(steps.length).toBeGreaterThanOrEqual(5);

    const stepTypes = steps.map((s) => s.state.packets.map((p) => p.type).join(','));
    expect(stepTypes).toContain('SYN');
    expect(stepTypes).toContain('SYN-ACK');
    expect(stepTypes).toContain('ACK');
    expect(steps[steps.length - 1].state.logMessage).toContain('ESTABLISHED');
  });
});
