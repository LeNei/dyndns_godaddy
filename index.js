const fetch = require('node-fetch');
const { domain, hostname, apikey } = require('./config');

const compareIps = async () => {
    const ipPage = await fetch('https://api.ipify.org');
    const ip = await ipPage.text();
    console.log(`Current IP: ${ip}`);
    const dnsPage = await fetch(`https://api.godaddy.com/v1/domains/${domain}/records/A/${hostname}`, {headers: {'Authorization': `sso-key ${apikey}`}})
    const dnsData = await dnsPage.json();

    if(dnsData && dnsData.length){
      console.log(`DNS IP: ${dnsData[0].data}`)
      if(ip === dnsData[0].data){
        return [true, ip, dnsData[0].data]
      }
      return [false, ip, dnsData[0].data];
    }
    return [false, ip, undefined];
}

const updateIp = async (newIp) => {
  const data = [{data: newIp}]
  const res = await fetch(`https://api.godaddy.com/v1/domains/${domain}/records/A/${hostname}`,
  {
    method: 'PUT',
    headers: {
      'Authorization': `sso-key ${apikey}`,
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if(res.status === 200){
    return true;
  }
  return false;
}

const logic = async () =>{
  const [isSame, ip, dns] = await compareIps();
  if(!isSame){
    console.log("Ip has Changed. Updating...");
    const change = await updateIp(ip);
    if(change){
      console.log(`Updated DNS from ${dns} to ${ip}`);
    }else{
      console.log(`Failed updating DNS`);
    }
    process.exit(0);
  }
}

logic();