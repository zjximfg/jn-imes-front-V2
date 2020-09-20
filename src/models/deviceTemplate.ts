import {useCallback, useState} from "react";


const deviceTemplateModel = () => {

  const [templateId, setTemplateId] = useState<string | undefined>(undefined);

  const changeTemplateId = useCallback((id: string | undefined) => {
    setTemplateId(id);
  }, []);

  return {
    templateId,
    changeTemplateId
  }

};

export default deviceTemplateModel;
