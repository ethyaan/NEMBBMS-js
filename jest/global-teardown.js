export default async function globalTeardown() {
    const instance = global.__MONGOINSTANCE;
    await instance.stop();
    console.log('Destroying MongoDB in-memory server');
};