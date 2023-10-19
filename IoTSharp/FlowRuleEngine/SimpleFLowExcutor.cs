using RulesEngine.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IoTSharp.FlowRuleEngine
{
    public interface IFlowExcutor<T>
    {
        Task<List<RuleResultTree>> Excute(T Input);
    }

    public interface IFlowEntity
    {
    }

    public class FlowExcuteEntity : IFlowEntity
    {
        public dynamic Params { get; set; }
        public BaseRuleTask Task { get; set; }
        //public Action Action { get; set; }
        //public int WaitTime { get; set; }
    }

    public class SimpleFlowExcutor : IFlowExcutor<FlowExcuteEntity>
    {
        /// <summary>
        /// Call the rule engine to process the online logic and determine whether it is True, which is used to determine whether to continue to the next node.
        /// </summary>
        /// <param name="Input"></param>
        /// <returns></returns>
        public async Task<List<RuleResultTree>> Excute(FlowExcuteEntity Input)
        {
            var mainRules = new Workflow
            {
                WorkflowName = Input.Task.id,
            };

            foreach (var item in Input.Task.outgoing)
            {
                item.Rule.Operator = item.id;
            }
            //Rule collection, you can refer to the RulesEngine.RulesEngine program description. Many of the required parameters have been hard-coded and only the Expression front-end is filled in, such as Age>18
            /**
             * //Define rules
        var rulesStr = @"[{
        ""WorkflowName"":""UserInputworkflow"",
        ""Rules"":[
.{
            "RuleName"":"CheckAge"
            "ErrorMessage"":""Age must be greater than 18 years old."",
            ""ErrorType"":""Error"",
            ""RuleExpressionType"":"LambdaExpression"",
            ""Expression"":""Age > 18""
          },
         {
            ""RuleName"" :"CheckIDNoIsEmpty"",
            ""ErrorMessage"":""ID card number cannot be empty."",
            ""ErrorType"":"Error"",
            ""RuleExpressionType"":""LambdaExpression"",
            ""Expression"":""IdNo != null""
          }
        }]";
          **/
            mainRules.Rules = Input.Task.outgoing.Select(c => c.Rule).ToList();
            //Calling the rule engine to execute the rules and judging if the verification is successful, IsSuccess=true will be returned
            var bre = new RulesEngine.RulesEngine(new[] { mainRules }, null);
            return await bre.ExecuteAllRulesAsync(Input.Task.id, Input.Params);
        }
    }
}