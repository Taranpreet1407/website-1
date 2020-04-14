/*
Discord Extreme List - Discord's unbiased list.

Copyright (C) 2020 Cairo Mitchell-Acason, John Burke, Advaith Jagathesan

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const ioRedis = require("ioredis");

const settings = require("../../../settings.json");
const discord = require("./discord.js");
const redisBans = new ioRedis(settings.db.redis.bans);

async function check(user) {
    const rawBans = await redisBans.get("bans");
    const bans = JSON.parse(rawBans);

    let banned = false;
    
    for (var n = 0; n < bans.length; ++n) {
        const ban = bans[n];
        
        if (ban.user.id === user) banned = true;
    }

    return banned;
}

async function updateBanlist() {
    const bans = discord.bot.guilds.get(settings.guild.main).getBans();
    redisBans.set("bans", JSON.stringify(bans));
}

setInterval(async () => {
    await updateBanlist();
}, 900000);

module.exports = {
    check,
    updateBanlist
};