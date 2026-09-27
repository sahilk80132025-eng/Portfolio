using System;
using System.IO;
using System.Text;
class Program {
    static void Main() {
        string[] files = { "index.html", "vexma.html", "paradise.html", "amora.html" };
        foreach (var f in files) {
            if (File.Exists(f)) {
                string c = File.ReadAllText(f, Encoding.UTF8);
                c = c.Replace("Ã¢â‚¬â€ ", "—");
                c = c.Replace("â–¾", "?");
                c = c.Replace("LetÃ¢â‚¬â„¢s", "Let’s");
                c = c.Replace("â€“", "–");
                c = c.Replace("ðŸ”—", "??");
                c = c.Replace("â€”", "—");
                File.WriteAllText(f, c, Encoding.UTF8);
            }
        }
    }
}
