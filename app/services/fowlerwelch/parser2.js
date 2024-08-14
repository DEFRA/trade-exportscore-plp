const CombineParser = require("../parser-combine");

function parse(packingListJson) {
  const sheets = Object.keys(packingListJson);
  let packingListContents = [];
  //console.log(packingListJson)
  const establishmentNumberRow = 45;

  const establishmentNumber = packingListJson[sheets[0]][establishmentNumberRow].M ?? null;
  for (let i = 0; i < sheets.length; i++){
   const packingListContentsTemp = packingListJson[sheets[i]]
    .slice(establishmentNumberRow)
    .map((col) => ({
      description: col.F ?? null,
      nature_of_products: null,
      type_of_treatment: col.N ?? null,
      commodity_code: col.C ?? null,
      number_of_packages: col.H ?? null,
      total_net_weight_kg: col.K ?? null,
    }));
    
   packingListContents = packingListContents.concat(
      packingListContentsTemp
         )
        
  }
  
  //console.log(packingListContents);

  // for (let i = 0; i < sheets.length; i++) {
  //  // console.log(packingListJson[sheets[i]][establishmentNumberRow]);
  //   //console.log(packingListJson[sheets]);
  //   establishmentNumber =
  //     packingListJson[sheets[i]][establishmentNumberRow].M ?? null;
  //   let packing = packingListJson[sheets[i]]
  //   console.log(packing)
  //     let packing1 = packing
  //     .slice(45)
  //     .map((col) => ({
  //       description: col.F ?? null,
  //       commodity_code: col.C ?? null,
  //       number_of_packages: col.H ?? null,
  //       nature_of_products: null,
  //       total_net_weight_kg: col.K ?? null,
  //       type_of_treatment: col.N ?? null,
  //     }));
  //     console.log(packing1)
  //   // console.log(packingListContents);
  //   //console.log(packing)
  //   packingListContents = packing;
  //   //console.log(packingListContents)
  // }
  //console.log(CombineParser.combine(establishmentNumber, packingListContents, true))
  return CombineParser.combine(establishmentNumber, packingListContents, true);
}

module.exports = { parse };
