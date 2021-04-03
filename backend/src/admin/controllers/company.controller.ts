import { Response } from "express";
import { wrap } from "@src/server";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { Types } from "mongoose";
import { CompanyRepository } from "@src/repositories/company.repository";
import { OK, CREATED, BAD_REQUEST } from "http-status-codes";
import { IResponseData, ResponseStatus } from "@src/types/common.type";

const getCompanies = wrap(async (req: ISessionRequest, res: Response) => {
  const { pageIndex} = req.query;

  try {
    const result = await CompanyRepository.getCompanies(+pageIndex);

    if (!result) {
      throw new Error();
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result,
    };

    return res.status(OK).send(data);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "NO_RECORDS_FOUND",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

const getCompany = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;
  try {
    if (!id) {
      throw new Error();
    }

    const company = await CompanyRepository.getCompany(id.toString());

    if (!company) {
      throw new Error();
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: company,
    };

    return res.status(OK).send(data);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "NO_RECORD_FOUND",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

const addCompany = wrap(async (req: ISessionRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const { name, address } = req.body;
    const data = {
      name,
      address,
      createdBy: Types.ObjectId(userId),
    };

    const company = await CompanyRepository.addCompany(data);

    if (!company) {
      throw new Error();
    }

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: company,
    };

    return res.status(CREATED).send(rsData);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "SOMETHING_WENT_WRONG",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

const updateCompany = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;
  const { name, address } = req.body;
  try {
    if (!id) {
      throw new Error();
    }

    const company = await CompanyRepository.editCompany(
      Types.ObjectId(id),
      name,
      address
    );

    if (!company) {
      throw new Error();
    }

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: company,
    };

    return res.status(OK).send(rsData);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "SOMETHING_WENT_WRONG",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

const removeCompany = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new Error("COMPANY_NOT_FOUND");
    }

    const company = await CompanyRepository.removeCompany(Types.ObjectId(id));

    if (company && !company.deletedCount) {
      throw new Error("COMPANY_NOT_FOUND");
    }

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
    };

    return res.status(OK).send(rsData);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "SOMETHING_WENT_WRONG",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

export { getCompanies, getCompany, addCompany, updateCompany, removeCompany };
