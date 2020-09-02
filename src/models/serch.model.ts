import { ISearch } from "src/interfaces/app.interface";
import { IsNotEmpty } from "class-validator";

export class SearchModel implements ISearch{

    searchType?: string;
    searchText?: string;

    @IsNotEmpty()
    startPage: number;

    @IsNotEmpty()
    limitPage: number;
}