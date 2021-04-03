import { Response } from "express";
import { wrap } from "@src/server";
import { ISessionRequest } from "@src/types/account/session-request.type";
import { Types } from "mongoose";
import { StoreRepository } from "@src/repositories/store.repository";
import { OK, CREATED, BAD_REQUEST } from "http-status-codes";
import { IResponseData, ResponseStatus } from "@src/types/common.type";

const getStores = wrap(async (req: ISessionRequest, res: Response) => {
  const { pageIndex, pageSize, keyword } = req.query;

  try {
    const result = await StoreRepository.getStores(+pageIndex, +pageSize, keyword);

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

const getAllStores = wrap(async (req: ISessionRequest, res: Response) => {
  try {
    const result = await StoreRepository.getAllStores();

    if (!result) {
      throw new Error();
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result
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

const getStore = wrap(async (req: ISessionRequest, res: Response) => {
  const storeId = req.params.id;
  try {
    const store = await StoreRepository.getStore(
      Types.ObjectId(storeId + "")
    );

    if (!store) {
      throw new Error("STORE_NOT_EXIST");
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { store },
    };

    return res.status(OK).send(data);
  } catch (e) {
    const data: IResponseData = {
      status: ResponseStatus.FAILED,
      message: "STORE_NOT_EXIST",
    };

    return res.status(BAD_REQUEST).json(data);
  }
});

const addStore = wrap(async (req: ISessionRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const { name, address } = req.body;

    const data = {
      name,
      address,
      createdBy: Types.ObjectId(userId),
    };
    const store = await StoreRepository.addStore(data);

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { store },
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

const updateStore = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;
  const { name, address } = req.body;

  try {
    if (!id) {
      throw new Error();
    }

    const store = await StoreRepository.editStore(
      Types.ObjectId(id),
      name,
      address
    );

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: { store },
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

const removeStore = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new Error("STORE_NOT_FOUND");
    }

    const store = await StoreRepository.removeStore(Types.ObjectId(id));

    if (store && !store.deletedCount) {
      throw new Error("STORE_NOT_FOUND");
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

// Store table
const getStoreTables = wrap(async (req: ISessionRequest, res: Response) => {
  const { storeId } = req.params;
  const { pageIndex, pageSize, keyword } = req.query;

  try {
    if (!storeId) {
      throw new Error();
    }

    const result = await StoreRepository.getStoreTables(storeId, +pageIndex, +pageSize, keyword);

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

const getAllStoreTables = wrap(async (req: ISessionRequest, res: Response) => {
  const { storeId } = req.params;
  try {
    const result = await StoreRepository.getTablesByStoreId(Types.ObjectId(storeId));

    if (!result) {
      throw new Error();
    }

    const data: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: result
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

const addStoreTable = wrap(async (req: ISessionRequest, res: Response) => {
  try {
    const { storeId, name } = req.body;

    const data = {
      storeId,
      name
    };
    const store = await StoreRepository.addStoreTable(data);

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: store,
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

const updateStoreTable = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (!id) {
      throw new Error();
    }

    const storeTable = await StoreRepository.editStoreTable({
      id: Types.ObjectId(id),
      name,
    });

    if (!storeTable) {
      throw new Error();
    }

    const rsData: IResponseData = {
      status: ResponseStatus.SUCCESS,
      data: storeTable,
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

const removeStoreTable = wrap(async (req: ISessionRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new Error("STORE_TABLE_NOT_FOUND");
    }

    const store = await StoreRepository.removeStoreTable(Types.ObjectId(id));

    if (store && !store.deletedCount) {
      throw new Error("STORE_TABLE_NOT_FOUND");
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

export {
  getStores, getAllStores, getStore, addStore, updateStore, removeStore,
  getStoreTables, getAllStoreTables, addStoreTable, updateStoreTable, removeStoreTable
};
