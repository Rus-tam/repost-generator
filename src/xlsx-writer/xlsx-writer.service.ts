import { BadRequestException, Injectable } from "@nestjs/common";
import { IColWidth } from "src/interfaces/colWidth.interface";
import { ITxtData } from "src/interfaces/txtData.interface";
import { IXlsxData } from "src/interfaces/xlsxData.interface";
import { TxtReaderService } from "src/txt-reader/txt-reader.service";
import { UtilsService } from "src/utils/utils.service";
import { XlsxReaderService } from "src/xlsx-reader/xlsx-reader.service";
import * as xlsx from "xlsx";

@Injectable()
export class XlsxWriterService {
  constructor(
    private readonly txtReaderService: TxtReaderService,
    private readonly xlsxReaderService: XlsxReaderService,
    private readonly utilsService: UtilsService,
  ) {}

  async createXlsxFile() {
    const colInfo: IColWidth[] = [];
    const txtData: ITxtData = await this.txtReaderService.parseTXTFile();
    const xlsxData: IXlsxData = await this.xlsxReaderService.parseXlsxFile();

    for (let i = 0; i < 11; i++) {
      colInfo.push({ wch: 25 });
    }

    const excelData = this.utilsService.mainJsonCreator(txtData, xlsxData);

    try {
      let workBook = xlsx.utils.book_new();
      const workSheet = xlsx.utils.json_to_sheet(excelData);
      workSheet["!cols"] = colInfo;
      xlsx.utils.book_append_sheet(workBook, workSheet, "Main Data");
      xlsx.writeFile(workBook, "response.xlsx");
    } catch (e) {
      throw new BadRequestException("Закройте открытый файл Excel");
    }
  }
}
