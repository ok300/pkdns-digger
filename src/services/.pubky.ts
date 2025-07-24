// import { Client, Keypair, PublicKey } from '@synonymdev/pubky';

// export type KeyPair = {
//     publicKey: string;
//     secretKey: string;
//   };


// export class HomeserverService {
//   private static instance: HomeserverService;
//   private client: Client;
//   private currentKeypair: Keypair | null = null;
// //   private currentSession: SignupResult['session'] | null = null;
//   private testnet = process.env.NEXT_PUBLIC_TESTNET?.toString() === 'true';
//   private pkarrRelays = process.env.NEXT_PUBLIC_PKARR_RELAYS?.split(',') ?? null;
// //   private homeserverPublicKey = PublicKey.from(process.env.NEXT_PUBLIC_HOMESERVER);

//   // Flag to skip profile creation during tests
//   private skipProfileCreation = process.env.VITEST === 'true';

//   private constructor() {
//     this.client = this.testnet
//       ? Client.testnet()
//       : new Client({
//           pkarr: { relays: this.pkarrRelays, requestTimeout: null },
//           userMaxRecordAge: null,
//         });
//   }

//   async fetch(url: string, options?: any): Promise<Response> {
//     try {

//       const response = await this.client.fetch(url, { ...options, credentials: 'include' });

//       return response;
//     } catch (error) {
//       throw error;
//     }
//   }

//   generateRandomKeypair(): Keypair {
//     try {
//       const keypair = Keypair.random();
//       this.currentKeypair = keypair;
//       return keypair;
//     } catch (error) {
//       throw error;
//     }
//   }

//   generateRandomKeys(): KeyPair {
//     try {
//       const random_keypair = this.generateRandomKeypair();

//       return {
//         publicKey: random_keypair.publicKey().z32(),
//         secretKey: random_keypair.secretKey().toString(),
//       };
//     } catch (error) {
//       throw error;
//     }
//   }

//   keypairFromSecretKey(secretKey: Uint8Array): Keypair {
//     try {
//       if (secretKey.length !== 32) {
//         throw new Error('Invalid secret key length');
//       }
//       const keypair = Keypair.fromSecretKey(secretKey);
//       this.currentKeypair = keypair;

//       return keypair;
//     } catch (error) {
//       throw error;
//     }
//   }

//   getClient(): Client {
//     const client = this.client;
//     return client;
//   }

//   getCurrentKeypair(): Keypair | null {
//     const keypair = this.currentKeypair;
//     return keypair;
//   }

//   getCurrentPublicKey(): string | null {
//     const publicKey = this.currentKeypair?.publicKey().z32();
//     return publicKey ?? null;
//   }
// }