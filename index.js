import pkg from "discord.js"
import { ethers } from "ethers"
const { Client, GatewayIntentBits, Events } = pkg
let provider = new ethers.JsonRpcProvider("https://rpc.sepolia.org")
const wallet = new ethers.Wallet(
  "you faucet wallet private key",
  provider
)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ],
})

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on(Events.MessageCreate, (msg) => {
  //   console.log("message: ", msg);

  if (msg.content.startsWith("!GiveMeEth")) {
    let res = msg.content.split(" ")
    if (!res.at(1)) {
      msg.reply('Must input "!GiveMeEth  <Your ETH Address>"')
    } else {
      const tx = {
        to: res.at(1),
        value: ethers.parseEther("0.001"),
      }
      wallet
        .sendTransaction(tx)
        .then((req) => {
          req
            .wait()
            .then((req) => {
              msg.reply(`OK! ETH is send to your Address: ${res.at(1)}`)
            })
            .catch((req) => {
              msg.reply("Error! send failed")
            })
        })
        .catch((req) => {
          msg.reply("Error! send failed")
        })
    }
  }
})

client.login(
  "your discord bot token"
)